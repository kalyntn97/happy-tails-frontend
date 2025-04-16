import React, { useEffect, useRef } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
//components
import { ActionButton, MainButton, ToggleButton } from '@components/ButtonComponents'
import FrequencyPicker, { getRepeatLabels } from '@components/Pickers/FrequencyPicker'
import PetPicker from '@components/Pickers/PetPicker'
import { DateInput, ErrorMessage, FormError, FormHeader, FormInput, HelperText, Icon, ModalInput, NoteInput, VScrollContainer, TableForm, TitleLabel } from '@components/UIComponents'
//helpers & types
import useForm from '@hooks/useForm'
import { Dosage, Medication, MedicationFormData, Refill } from '@pet/PetInterface'
//styles
import ToggleableForm from '@components/ToggleableForm'
import { Header } from '@navigation/NavigationStyles'
import { useNavigation } from '@react-navigation/native'
import { Colors, Spacing, Typography } from '@styles/index'
import { styles } from '@styles/stylesheets/FormStyles'
import { DEFAULT_FREQUENCY } from '@utils/constants'

interface MedicationFormProps {
  initialValues?: MedicationFormData
  onSubmit: (type: 'meds', medFormData: MedicationFormData) => void
  isPending: boolean
}
interface InitialState extends MedicationFormData { reminder: boolean, errors: any }

const DEFAULT_DOSAGE = { dose: null, startDate: new Date().toISOString(), endDate: null, ending: false, frequency: DEFAULT_FREQUENCY, reminder: false }

const getDosageLabel = (dosage: Dosage) => {
  const startDateLabel = new Date(dosage.startDate).toLocaleDateString()
  const { timesPerIntervalLabel, intervalLabel, endingLabel } = getRepeatLabels({ ...dosage.frequency, endDate: dosage.endDate, ending: dosage.ending })
  const repeatLabel = (timesPerIntervalLabel && intervalLabel) ? ` ${timesPerIntervalLabel} ${intervalLabel} from ${startDateLabel}${endingLabel ? ` ${endingLabel}` : ''}` : ''
  return `${dosage.dose ?? 'Unknown amount'} ${repeatLabel}`
}

const DosageSelector = ({ dosage, onSelect }: { dosage: Dosage, onSelect: (data: Dosage) => void }) => {
  const inputRef = useRef(null)

  const dosageLabel = getDosageLabel(dosage)

  const dosageTable = [
    { key: 'dose', label: 'Dose', icon: 'medication', value:
      <View style={{ flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
        <FormInput ref={inputRef} initial={dosage?.dose} onChange={(text: string) => onSelect({ ...dosage, dose: text })} placeholder='Enter dose' withBorder={false} align='right' />
        { dosage && !dosage.dose && <ErrorMessage error='Required fields.' /> } 
      </View>
    },
    { key: 'startDate', label: 'Start Date', icon: 'schedule', value: 
      <DateInput date={dosage?.startDate} onChangeDate={(selected) => onSelect({ ...dosage, startDate: selected })} />  
    },  
    { key: 'frequency', label: 'Frequency', icon: 'due', value: 
      <FrequencyPicker frequency={{ ...dosage?.frequency, endDate: dosage?.endDate, ending: dosage?.ending }}
        onSelectFrequency={(key: string, selected: any) => onSelect({ ...dosage, [key]: selected })}
        onSelectEndDate={(key: 'ending' | 'endDate', value: boolean | string) => onSelect({ ...dosage,[key]: value })}
        onReset={() => onSelect(null)}
      /> 
    },
  ]

  return (
    <ModalInput customLabel={
      <View>
        <Text style={{flexWrap: 'wrap' }}>{dosageLabel}</Text>
        <HelperText text='Tap to edit' />
      </View>
    }>
      <TableForm table={dosageTable} />
    </ModalInput>
  )
}

const DosageEditor = ({ dosages, index, updateDosages }: { dosages: Medication['dosages'], index: number, updateDosages: (dosages: Dosage[]) => void }) => (
  <View style={Spacing.flexRowStretch}>
    <ActionButton icon='cancel' size='xSmall' onPress={() => updateDosages(dosages.filter((d, i) => i !== index))} buttonStyles={{ marginRight: 15 }} />
    <DosageSelector dosage={dosages[index]} onSelect={(data: Dosage) => updateDosages(dosages.map((d, i) => i === index ? data : d))} />
  </View>
)

const DosageManager = ({ dosages, onChange }: { dosages: Medication['dosages'], onChange: (dosages: Medication['dosages']) => void }) => (
  <ModalInput height='100%' animation='horizontal'
    label={dosages.length ? 
      getDosageLabel(dosages[dosages.length - 1])
      : 'No dosage added.'
    }
  > 
    <View style={[Spacing.flexColumn, { paddingHorizontal: 20 }]}>
      <Text style={Typography.smallHeader}>Current Dosage</Text>
      { dosages.length ? 
        <DosageEditor dosages={dosages} index={dosages.length - 1} updateDosages={(data: Dosage[]) => onChange(data)} />
        : <MainButton title='Add dosage' onPress={() => onChange([...dosages, DEFAULT_DOSAGE])} />
      }

      { dosages.length > 1 &&
        <ToggleableForm title='Previous dosages' buttonStyles={{ marginTop: 30 }}>
          { [...dosages].reverse().map((_, i) => 
            i > 0 && <DosageEditor key={i} dosages={dosages} index={i} updateDosages={(data: Dosage[]) => onChange(data)} />
          )}
        </ToggleableForm> 
      }
    </View>
  </ModalInput>
)

const getLabel = (refill: Medication['refill']) => {
  if (refill) {
    const { intervalLabel, timesPerIntervalLabel } = getRepeatLabels(refill.frequency)
    return `Refill ${refill.count} ${intervalLabel} ${timesPerIntervalLabel}, reminder ${refill.reminder ? 'on' : 'off'}.`
  }
  else return 'No refill setup.'
}

const RefillManager = ({ refill, onChange }: { refill: MedicationFormData['refill'], onChange: (data: MedicationFormData['refill']) => void }) => {
  const inputRef = useRef(null)
  const label = getLabel(refill)

  const toggleRefill = () => {
    refill ? onChange(null) : onChange({ isActive: true, count: 1, frequency: DEFAULT_FREQUENCY, reminder: false })
  }

  const refillTable = [
    { key: 'count', label: 'Count', icon: 'no', value: 
      <FormInput ref={inputRef} initial={refill?.count.toString()} maxLength={3} onChange={(text: string) => onChange({ ...refill, count: Number(text) })} placeholder='Enter count' withBorder={false} align='right' /> 
    },
    { key: 'repeat', label: 'Frequency', icon: 'due', value: 
      <FrequencyPicker 
        frequency={{ ...refill?.frequency }}
        onSelectFrequency={(key: string, selected: any) => onChange({ ...refill, [key]: selected })}
        onReset={() => onChange(null)}
      />  
    },
    { key: 'reminder', label: 'Reminder', icon: 'reminder', value: 
      <ToggleButton isOn={!!refill?.reminder} onPress={() => onChange({ ...refill, reminder: !refill.reminder })} />
    },
  ]

  return (
    <ModalInput label={label} overlay={Colors.white}>
      <FormHeader title={label} size='small' />
      <TitleLabel title='Refill' iconName='repeat' size='med' mode='bold' rightAction={
        <ToggleButton isOn={refill ? refill.isActive : false} onPress={toggleRefill} />
      } />
      { refill?.isActive && 
        <TableForm table={refillTable} />
      }
    </ModalInput>
  )
}

const MedicationForm = ({ initialValues, onSubmit, isPending }: MedicationFormProps) => {
  const initialState: InitialState = { 
    name: initialValues?.name ?? null, 
    dosages: initialValues?.dosages ?? [],
    refill: initialValues?.refill ?? null,
    isActive: initialValues?.isActive ?? true,
    reminder: !!initialValues?.reminder ?? false,
    notes: initialValues?.notes ?? null,
    medId: initialValues?.medId ?? null,
    errors: {}
  }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, dosages, refill, isActive, reminder, notes, medId, errors }: InitialState = values

  const navigation = useNavigation()

  function handleSubmit() {
    onSubmit('meds', { name, dosages, refill, isActive, reminder, notes, medId })
  }

  function handleValidate() {
    onValidate({ name, dosages })
  }

  const mainTable = [
    { key: 'dosage', label: 'Dosage', icon: 'medication', value:
      <>
        <DosageManager dosages={dosages} onChange={(data: Medication['dosages']) => onChange('dosages', data)} /> 
        <FormError errorKey='dosages' errors={errors} />
      </>
    },
    { key: 'refill', label: 'Refill', icon: 'repeat', value: 
      <RefillManager refill={refill} onChange={(data: Medication['refill']) => onChange('refill', data)} />
    },
    { key: 'status', label: 'Active', icon: 'check', value: 
      <ToggleButton isOn={isActive} onPress={() => onChange('isActive', !isActive)} />
    },
    { key: 'notes', label: 'Notes', icon: 'note', value: 
      <NoteInput notes={notes} onChange={(text: string) => onChange('notes', text)} />
    },
    { key: 'reminder', label: 'Reminder', icon: 'reminder', value:       
      <ToggleButton isOn={reminder} onPress={() => onChange('reminder', !reminder)} />
    },
  ]

  const headerActions = [
    { icon: 'reset', onPress: onReset },
    { title: isPending ? 
      <Text style={Spacing.flexRow}><ActivityIndicator /> Submitting...</Text>
      : 'Submit', onPress: handleValidate },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
    })
  }, [headerActions])

  return (
    <VScrollContainer props={{ keyboardShouldPersistTaps: 'never' }}>
      <View style={styles.headerCon}>
        <Icon type='pet' name='medication' size='large' />
        <View style={styles.titleCon}>
          <FormInput initial={name} placeholder="New Medication Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} width='100%' bottom={0} />
        </View>
      </View>

      <TableForm table={mainTable} errors={errors} />
    </VScrollContainer>
  )
}

export default MedicationForm