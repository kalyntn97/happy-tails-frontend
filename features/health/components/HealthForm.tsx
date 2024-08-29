import Fuse from "fuse.js"
import { useEffect, useMemo } from "react"
import { View } from "react-native"
//store && types & helpers
import { Health, HealthFormData, Visit } from "@health/HealthInterface"
import * as healthHelpers from '@health/healthHelpers'
import { FormErrors } from "@utils/types"
//hooks & utils
import { useShallowPets } from "@hooks/sharedHooks"
import useForm from "@hooks/useForm"
import { compareDates, getDateFromRange, getDateInfo } from "@utils/datetime"
//components
import { ActionButton, ToggleButton } from "@components/ButtonComponents"
import Dropdown from "@components/Dropdown/Dropdown"
import FrequencyPicker from "@components/Pickers/FrequencyPicker"
import IconPicker from "@components/Pickers/IconPicker"
import PetPicker from "@components/Pickers/PetPicker"
import TitleInput from "@components/TitleInput"
import { FormError, Icon, ModalInput, TableForm, TitleLabel } from "@components/UIComponents"
import { Header } from "@navigation/NavigationStyles"
import VisitForm from "./VisitForm"
//styles
import { UI } from "@styles/index"
import { styles } from "@styles/stylesheets/FormStyles"

interface HealthFormProps {
  onSubmit: (formData: HealthFormData) => void
  initialValues?: Health
  navigation: any
  status: string
}
interface InitialState extends HealthFormData {
  errors: FormErrors
}

const vaccineFuse = new Fuse(['vaccination', 'vaccine'])

const HealthForm: React.FC<HealthFormProps> = ({ onSubmit, initialValues, navigation, status }) => {
  const { petIdToColor, PET_BASICS, petIdToPet } = useShallowPets()
  const { date, monthName } = getDateInfo('today')

  const initialState: InitialState = {
    name: initialValues?.name ?? null,
    details: initialValues?.details ?? null,
    pet: initialValues?.pet ?? PET_BASICS[0],
    type: initialValues?.type ?? 'Routine',
    repeat: initialValues?.repeat ?? false,
    frequency: initialValues?.frequency ?? { type: 'years', interval: 1, timesPerInterval: [{ month: monthName.slice(0, 3), day: date }] },
    lastDone: initialValues?.lastDone ?? [],
    nextDue: initialValues?.nextDue ?? null,
    healthId: initialValues?._id ?? null,
    errors: {},
  }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)

  const { name, details, pet, type, repeat, frequency, lastDone, nextDue, healthId, errors }: InitialState = values

  const sortedVisits = [...lastDone].sort((a: Visit, b: Visit) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  
  const isVaccine = useMemo(() => {
    const search = name ? vaccineFuse.search(name) : null
    return !!search?.length && (pet.species === 'Cat' || pet.species === 'Dog')
  }, [name, pet.species])

  function handleSubmit() {
    if (!repeat) ['frequency', 'lastDone', 'nextDue'].map(key => onChange(key, null))
    onSubmit({ name, details, type, pet, repeat, frequency, lastDone, nextDue, healthId })
  }

  const handleValidate = () => repeat ? onValidate({ name, type }) : onValidate({ name, type, 'last visit': lastDone })
  
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

  const handleUpdateFrequency = (key: string, selected: string ) => {
    onChange('frequency', frequency[key] ? { ...frequency, [key]: selected } : selected)
    if (sortedVisits.length) updateNextDue()
  }

  const mainTable = [
    { key: 'pet', label: 'Pet', icon: 'pet', value: 
      <PetPicker pets={[pet]} onSelect={(selected: string[]) => onChange('pet', selected[0])} /> 
    },
    { key: 'type', label: 'Type', icon: 'healthType', value: 
      <ModalInput label={type}>
        <IconPicker selected={type} options={healthHelpers.HEALTH_TYPES_OPTIONS} initial={initialState.type} onSelect={(selected: string) =>  onChange('type', selected)} pickerStyles={{ marginTop: 15 }}/>
      </ModalInput> 
    },
    { key: 'repeat', label: 'Repeat', icon: 'repeat', value: 
      <ToggleButton onPress={handleToggleRepeat} isChecked={repeat} />
    },
    { key: 'frequency', label: 'Frequency', icon: 'due', value: 
      <FrequencyPicker frequency={frequency} color={pet.color}
        onSelectFrequency={handleUpdateFrequency}
        onReset={() =>  onChange('frequency', initialState.frequency)}
      />
    },
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
    <View style={styles.container}>
      <TitleInput initial={initialState.name} placeholder='New Vet Visit' onChange={(input: string) => onChange('name', input)} type='health' error={errors?.name} />
      { isVaccine &&
        <Dropdown label='Search Vaccine' withSearch={true} searchLabel='vaccine' dataType={pet.species === 'Cat' ? 'catVaccines' : 'dogVaccines'} onSelect={(selected: string) => onChange('details', { ...details, ['vaccine']: selected })} initial={details.vaccine} width='80%' buttonStyles={{ ...UI.input(), alignSelf: 'center' }} />
      }

      <TableForm table={mainTable} withTitle={true} dependentRows={{ frequency: repeat }}/>

      <TitleLabel title='Next Visit' iconName='schedule' />
      <View style={styles.contentCon}>
        { nextDue ? 
          <ModalInput customLabel={
            <View style={[styles.rowCon, { borderBottomWidth: 0 }]}>
              <ActionButton icon='decrease' onPress={() => onChange('nextDue', null)} 
                title={`Due ${new Date(nextDue.dueDate).toDateString()}`}  
              />
              <Icon name={nextDue.appointment.completed ? 'done' : 'skipped'} />
            </View>
          }>
            <VisitForm initialValues={nextDue} onSetVisit={(formData: Visit) => onChange('nextDue', formData)} pet={pet} isDue={true} />
          </ModalInput>
          : <ActionButton title='add visit' icon='increase'
            onPress={() => onChange('nextDue', { dueDate: new Date(), overdue: false, appointment: { date: new Date(), vet: null, completed: false }, notes: null }) } 
          />
        }
      </View>

      <TitleLabel title='Previous Visits' iconName='schedule' />
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
        <ActionButton title='add visit' icon='increase' onPress={handleAddVisit} buttonStyles={{ paddingTop: sortedVisits.length ? 15 : 0 }}/>
      </View>
    </View>
  )
}

export default HealthForm