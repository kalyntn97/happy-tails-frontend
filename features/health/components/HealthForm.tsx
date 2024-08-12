import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import Fuse from "fuse.js"
//store && types & helpers
import { Health, Visit } from "@health/HealthInterface"
import { FormErrors, Frequency } from "@utils/types"
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
import { BoxWithHeader, DateInput, FormError, FormLabel, Icon, ModalInput, NoteInput, TableForm } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
//styles
import { styles } from "@styles/stylesheets/FormStyles"
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import PetInfo from "@components/PetInfo/PetInfo"
import IconPicker from "@components/Pickers/IconPicker"
import { compareDates, getDateFromRange } from "@utils/datetime"

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
    lastDone: initialValues?.lastDone ?? [],
    nextDue: initialValues?.nextDue ?? null,
    _id: initialValues?._id ?? null,
    errors: {},
  }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)

  const { name, details, pet, type, repeat, frequency, icon, lastDone, nextDue, _id, errors }: InitialState = values
  const sortedVisits = [...lastDone].sort((a: Visit, b: Visit) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  
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

  const updateNextDue = (latestDueDate: string = sortedVisits[0].dueDate) => {
    const nextDueDate = getDateFromRange(latestDueDate, frequency.type.slice(0, -1), frequency.interval, 1, frequency.timesPerInterval)

    const overdue = compareDates('today', nextDueDate.toISOString())
    onChange('nextDue', { dueDate: nextDueDate, overdue: overdue, appointment: { date: nextDueDate, vet: null, completed: false }, notes: null }) 
  }

  const handleAddVisit = () => {
    let newDueDate = new Date()
    let lastDueDate = sortedVisits.length ? sortedVisits[sortedVisits.length - 1].dueDate : 'today'

    if (repeat && frequency) {
      if(!nextDue) updateNextDue(lastDueDate)
      newDueDate = getDateFromRange(lastDueDate, frequency.type.slice(0, -1), frequency.interval, -1, frequency.timesPerInterval)
    } else newDueDate = getDateFromRange(lastDueDate, 'day', 1, -1)

    const overdue = compareDates(newDueDate.toISOString(), 'today') < 0
    onChange('lastDone', [...sortedVisits, { dueDate: newDueDate, overDue: overdue, appointment: { date: newDueDate, vet: null, completed: true }, notes: null } ])
  }
    const handleDeleteVisit = (index: number) => {
    if (sortedVisits.length === 1) onChange('nextDue', null)
    else if (index === 0) updateNextDue()
    
    onChange('lastDone', sortedVisits.filter((_, idx) => idx !== index))
  }

  const handleUpdateVisit = (formData: Visit, index: number) => {
    const shouldUpdateNextDue = compareDates(formData.dueDate, sortedVisits[0].dueDate)
    if (shouldUpdateNextDue) updateNextDue(formData.dueDate)
    onChange('lastDone', sortedVisits.map((v, idx) => idx === index ? formData : v))
  }

  const handleToggleRepeat = () => {
    if (repeat === true) onChange('nextDue', null)
    if (!nextDue && sortedVisits.length) updateNextDue()
    onChange('repeat', !repeat)
  }

  const handleUpdateFrequency = (frequency: Frequency) => {
    onChange('frequency', frequency)
    if (sortedVisits.length) updateNextDue()
  }

  const renderPet = (
    <ModalInput customLabel={<PetInfo pet={petIdToPet(pet._id)} size="mini" />}>
      <PetPicker onSelect={(selected: string[]) => onChange('pet', selected[0])} initials={[pet?._id]} />
    </ModalInput>
  )

  const renderRepeat = (
    <ToggleButton onPress={handleToggleRepeat} isChecked={repeat} />
  )

  const renderFrequency = (
    <ModalInput maxHeight='90%'
      label={
        <Text style={{ maxWidth: '60%' }}>Repeats {frequency && frequencyMap[frequency.type].timesPerIntervalLabel(frequency.timesPerInterval)} {intervalLabel(frequency.interval, frequency.type)}</Text>
      }
      onReset={() => handleUpdateFrequency(initialState.frequency)}
    >
      <FrequencyPicker initial={frequency} color={petIdToColor(pet._id)}
        onSelectFrequency={(key: string, selected: any) => {
          const freq = frequency[key] ? { ...frequency, [key]: selected } : selected
          handleUpdateFrequency(freq)
        }}
      />
    </ModalInput>
  )

  const renderType = (
    <ModalInput label={type}>
      <IconPicker selected={type} options={healthHelpers.HEALTH_TYPES_OPTIONS} initial={initialState.type} onSelect={(selected: string) =>  onChange('type', selected)} pickerStyles={{ marginTop: 15 }}/>
    </ModalInput>
  )


  const mainTable = [
    { key: 'pet', label: 'Pet', icon: 'pets', value: renderPet },
    { key: 'type', label: 'Type', icon: 'healthType', value: renderType },
    { key: 'repeat', label: 'Repeat', icon: 'repeat', value: renderRepeat },
    { key: 'frequency', label: 'Frequency', icon: 'due', value: renderFrequency },
  ]

  const headerActions = [
    { icon: 'reset', onPress: onReset },
    { title: status === 'pending' ? 'Submitting...' : 'Submit', onPress: handleValidate },
  ]

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header showGoBackButton={true} rightActions={headerActions} navigation={navigation} mode='modal' />
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

      <FormLabel label='Next Visit' icon="schedule" />
      <View style={styles.contentCon}>
        { nextDue ? 
          <ModalInput customLabel={
            <View style={styles.rowCon}>
              <ActionButton icon='decrease' onPress={() => onChange('nextDue', null)} 
                title={`Due ${new Date(nextDue.dueDate).toDateString()}`}  
              />
              <Icon name={nextDue.appointment.completed ? 'done' : 'skipped'} />
            </View>
          }>
            <VisitForm initialValues={nextDue} onSetVisit={(formData: Visit) => onChange('nextDue', formData)} pet={pet} isDue={true} />
          </ModalInput>
          : <ActionButton title='add visit' icon='increase' buttonStyles={{ marginTop: 10 }}
            onPress={() => onChange('nextDue', { dueDate: new Date(), overdue: false, appointment: { date: new Date(), vet: null, completed: false }, notes: null }) } 
          />
        }
      </View>

      <FormLabel label='Previous Visits' icon="schedule" />
      <View style={styles.contentCon}>
        { errors.hasOwnProperty('last visit') && <FormError errors={errors} errorKey="last visit" /> }
        { sortedVisits.map((visit, index) =>
          <ModalInput key={`visit-${index}`} customLabel={
            <View style={styles.rowCon}>
              <ActionButton icon='decrease' onPress={() => handleDeleteVisit(index)}
                title={`${new Date(visit.appointment.date).toDateString()} at ${visit.appointment.vet?.name ?? 'Unknown Vet'}`}  
              />
              <Icon name={visit.appointment.completed ? 'done' : 'skipped'} />
            </View>
          }>
            <VisitForm initialValues={visit} onSetVisit={(formData: Visit) => handleUpdateVisit(formData, index)} pet={pet} />
          </ModalInput>
          
        )}
        <ActionButton title='add visit' icon='increase' onPress={handleAddVisit} buttonStyles={{ marginTop: 10 }} />
      </View>

    </ScrollView>
  )
}

export default HealthForm