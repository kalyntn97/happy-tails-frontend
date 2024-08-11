import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Fuse from "fuse.js"
//store && types & helpers
import { Health, Visit } from "@health/HealthInterface"
import { FormErrors } from "@utils/types"
import * as healthHelpers from '@health/healthHelpers'
import { windowHeight } from "@utils/constants"
//hooks
import { useShallowPets } from "@hooks/sharedHooks"
import useForm from "@hooks/useForm"
//components
import VisitForm from "./VisitForm"
import TitleInput from "@components/TitleInput"
import PetPicker from "@components/Pickers/PetPicker"
import FrequencyPicker, { frequencyMap, intervalLabel } from "@components/FrequencyPicker"
import Dropdown from "@components/Dropdown/Dropdown" 
import { SubButton } from "@components/ButtonComponents"
import { ActionButton, IconButton, ToggleButton } from "@components/ButtonComponents"
import { FormError, FormLabel, ModalInput, TableForm } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//styles
import { styles } from "@styles/stylesheets/FormStyles"
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import PetInfo from "@components/PetInfo/PetInfo"
import IconPicker from "@components/Pickers/IconPicker"

interface HealthFormProps {
  onSubmit: (formData: Health) => void
  initialValues?: Health
  navigation: any
  status: string
}
interface InitialState extends Health {
  errors: FormErrors
}

const vaccineFuse = new Fuse(['vaccination', 'vaccine'])

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const { petIdToColor, PET_BASICS, petIdToPet } = useShallowPets()

  const initialState: InitialState = {
    name: initialValues?.name ?? null,
    details: initialValues?.details ?? [],
    pet: initialValues?.pet ?? PET_BASICS[0],
    type: initialValues?.type ?? 'Routine',
    repeat: initialValues?.repeat ?? false,
    frequency: initialValues?.frequency ?? { type: 'days', interval: 1, timesPerInterval: [1] },
    icon: initialValues?.icon ?? null,
    lastDone: initialValues?.lastDone ?? null,
    nextDue: initialValues?.nextDue ?? null,
    _id: initialValues?._id ?? null,
    errors: {},
  }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)

  const { name, details, pet, type, repeat, frequency, icon, lastDone, nextDue, _id, errors } = values
  
  const isVaccine = useMemo(() => {
    const search = name ? vaccineFuse.search(name) : null
    return !!search?.length && (pet.species === 'Cat' || pet.species === 'Dog')
  }, [name, pet.species])

  function handleSubmit() {
    if (!repeat) ['frequency', 'lastDone', 'nextDue'].map(key => onChange(key, null))
    onSubmit({ name, details, type, pet, repeat, frequency, icon, lastDone, nextDue, _id })
  }

  const handleValidate = useCallback(() => {
    return repeat ? onValidate({ name, type }) : onValidate({ name, type, 'last visit': lastDone })
  }, [repeat, name, type, lastDone])

  const renderPet = (
    <ModalInput customLabel={<PetInfo pet={petIdToPet(pet._id)} size="mini" />}>
      <PetPicker onSelect={(selected: string[]) => onChange('pet', selected[0])} initials={[pet?._id ?? pet]} />
    </ModalInput>
  )

  const renderRepeat = (
    <ToggleButton onPress={() => onChange('repeat', !repeat)} isChecked={repeat} />
  )

  const renderFrequency = (
    <ModalInput maxHeight='90%'
      label={
        <Text style={{ maxWidth: '60%' }}>Repeats {frequency && frequencyMap[frequency.type].timesPerIntervalLabel(frequency.timesPerInterval)} {intervalLabel(frequency.interval, frequency.type)}</Text>
      }
      onReset={() => onChange('frequency', initialState.frequency)}
    >
      <FrequencyPicker initial={frequency} color={petIdToColor(pet._id)}
        onSelectFrequency={(key: string, selected: any) => onChange('frequency', frequency[key] ? { ...frequency, [key]: selected } : selected)}
      />
    </ModalInput>
  )

  const renderType = (
    <ModalInput label={type}>
      <IconPicker selected={type} options={healthHelpers.HEALTH_TYPES_OPTIONS} initial={initialState.type} onSelect={(selected: string) =>  onChange('type', selected)} pickerStyles={{ marginTop: 15 }}/>
    </ModalInput>
  )

  const renderPrevious = (
    <View>
      <ActionButton icon='increase' onPress={() => onChange('lastDone', { ...lastDone, dueDate: new Date(), appointment: null, notes: null, overDue: false })} size='small' />
    </View>
  )

  const mainTable = [
    { key: 'pet', label: 'Pet', icon: 'pets', value: renderPet },
    { key: 'type', label: 'Type', icon: 'healthType', value: renderType },
    { key: 'repeat', label: 'Repeat', icon: 'repeat', value: renderRepeat },
    { key: 'frequency', label: 'Frequency', icon: 'due', value: renderFrequency },
    { key: 'previous', label: 'Previous Visits', icon: 'schedule', value: renderPrevious },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightAction={handleValidate} rightLabel={status === 'pending' ? 'Submitting...' : 'Submit'} navigation={navigation} mode='modal' />
    })
  }, [handleValidate, status])

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
    >
      <TitleInput initial={initialState.name} placeholder='New Vet Visit' onChange={(input: string) => onChange('name', input)} type='health' error={errors?.name} />
      { isVaccine &&
        <Dropdown label='Search Vaccine' withSearch={true} searchLabel='vaccine' dataType={pet.species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={(selected: string) => onChange('details', [...details, selected])} initial={details[0]} width='80%' buttonStyles={{ ...UI.input, alignSelf: 'center' }} />
      }

      <TableForm table={mainTable} withLabel={true} dependentRows={{ frequency: repeat }}/>

      <FormLabel label='Previous Visits' icon="schedule" width='100%' />
        <FormError errors={errors} errorKey="last visit" />
        {lastDone && <Text>Due on {lastDone?.dueDate.toDateString()}. Appointment {lastDone?.appointment ? '' : 'not '}scheduled</Text>}
      <ModalInput 
        label={
          <View style={{ ...Spacing.flexRow }}>
            <ActionButton icon='increase' onPress={() => onChange('lastDone', { ...lastDone, dueDate: new Date(), appointment: null, notes: null, overDue: false })} />
            <Text>add visit</Text>
          </View>
        }
      >
        <VisitForm onSubmit={(formData: Visit) => onChange('lastDone', formData)} pet={pet} />
      </ModalInput>

      <SubButton onPress={onReset} title='Reset' top={40} />

    </ScrollView>
  )
}

export default HealthForm