import React from 'react'
import { View } from 'react-native'
//utils & hooks
import { useShallowPets } from '@hooks/sharedHooks'
import useForm from '@hooks/useForm'
import { Pet, PetBasic, Service } from '@pet/PetInterface'
import { compareDates } from '@utils/datetime'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import ServiceForm from '@pet/components/ServiceForm'
import { DateInput, ModalInput, NoteInput, TableForm } from '@components/UIComponents'
import { ToggleButton } from '@components/ButtonComponents'
//styles
import { Colors, Spacing } from '@styles/index'

type Props = {
  initialValues?: any
  pet: Pet
  onSetVisit: (formData: Visit) => void
  isDue?: boolean
}

const VetService = ({ vet, onSetVet, pet }: { vet: Service, onSetVet: (selected: Service) => void, pet: PetBasic }) => {
  const { petServices } = useShallowPets()
  const services = petServices(pet._id)

  return (
    <View>
      { vet ?
        <View style={Spacing.flexColumn}>
          {/* <Text>{appointment.vet.name}</Text>
          <Text>{appointment.vet.address}</Text>
          <Text>{appointment.vet.email}</Text>
          <Text>{appointment.vet.phone}</Text> */}
        </View>
      : <ModalInput label={'No vet added.'} onReset={() => onSetVet(null)}>
        { services.length > 0 ? <Dropdown width='70%' dataArray={services} onSelect={(selected: Service) => onSetVet(selected)} />
          : <ModalInput label='Add Vet' height='93%'>
            <ServiceForm />
          </ModalInput>  
        }
      </ModalInput>
      }
    </View>
  )
}

const AppointmentForm = ({ appointment, pet, onSetAppointment, isDue = true }: { appointment: any, pet: Pet, onSetAppointment: (formData: any) => void, isDue: boolean }) => {
  const renderAptDate = (
    <DateInput date={appointment?.date ?? new Date()} onChangeDate={(selected: Date) => {
      onSetAppointment({ ...appointment, date: selected })
    }} />
  )

  const renderVet = (
    <VetService vet={appointment.vet} onSetVet={(selected: Service) => onSetAppointment({ ...appointment, vet: selected })} pet={pet} />
  )

  const renderCompleted = (
    <ToggleButton isChecked={appointment.completed} onPress={() => onSetAppointment({ ...appointment, completed: !appointment.completed })} />
  )

  const formData = [
    { key: 'date', icon: 'schedule', value: renderAptDate },
    { key: 'vet', icon: 'vet', value: renderVet },
    { key: 'completed', icon: 'check', value: renderCompleted },
  ]

  return (
    <TableForm table={formData} dependentRows={{ completed: isDue }} />
  )
}

const VisitForm = ({ initialValues, pet, onSetVisit, isDue = false }: Props) => {
  const initialState = {
    dueDate: initialValues?.dueDate ?? new Date(),
    overdue: initialValues?.overdue ?? false,
    appointment: initialValues?.appointment ?? null,
    notes: initialValues?.notes ?? null,
    _id: initialValues?._id ?? null,
  }
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { dueDate, overdue, appointment, notes } = values

  const renderDueDate = (
    <DateInput date={dueDate} onChangeDate={(selected: Date) => {
      const overdue = compareDates(selected.toISOString(), 'today') < 0
      onChange('dueDate', selected)
      onChange('overdue', overdue)
      onSetVisit({ dueDate: selected, overdue: overdue, appointment, notes })
    }} buttonTextStyles={overdue && { color: Colors.red.darkest }} />
  )

  const renderAppointment = (
    <ModalInput label={appointment.completed ? `${appointment.date.toDateString()} ${appointment.vet ? appointment.vet.name : 'Unknown Vet'}` : 'No appointment scheduled.'} onReset={() => onChange('appointment', null)}>
      <AppointmentForm isDue={isDue} appointment={appointment} pet={pet} onSetAppointment={(formData) => {
        onChange('appointment', formData)
        onSetVisit({ dueDate, overdue, appointment: formData, notes })
      }} />
    </ModalInput>
  )

  const renderNotes = (
    <NoteInput notes={notes} onChange={(text: string) => {
      onChange('notes', text)
      onSetVisit({ dueDate, overdue, appointment, notes: text })
    }} />
  )

  const formData = [
    { key: 'dueDate', icon: 'due', value: renderDueDate },
    { key: 'appointment', icon: 'schedule', value: renderAppointment },
    { key: 'noteSquare', icon: 'note', value: renderNotes },
  ]

  function handleSubmit() {
    onSetVisit({ dueDate, overdue, appointment, notes })
  }
  
  return (
    <TableForm table={formData} />
  )
}

export default VisitForm