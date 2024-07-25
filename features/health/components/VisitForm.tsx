import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
//utils & hooks
import useForm from '@hooks/useForm'
//components
import { DateInput, FormInput, FormLabel, Icon, ModalInput, NoteInput, TableForm } from '@components/UIComponents'
//styles
import { Buttons, Colors, Spacing, UI } from '@styles/index'
import { getActionIconSource } from '@utils/ui'
import { Pet } from '@pet/PetInterface'
import { VisitFormData } from '@health/HealthInterface'
import MorePetDetailsScreen from '@pet/screens/MorePetDetailsScreen'
import { useNavigation } from '@react-navigation/native'
import { useShallowPets } from '@hooks/sharedHooks'
import Dropdown from '@components/Dropdown/Dropdown'
import PlaceHolder from '@components/PlaceHolder'
import { TransparentButton } from '@components/ButtonComponents'
import ToggleableForm from '@components/ToggleableForm'
import ServiceForm from '@pet/components/ServiceForm'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
  initialValues?: any
  pet: Pet
  onSubmit: (formData: VisitFormData) => void
}

const AppointmentForm = ({ appointment, pet, onSetAppointment }: { appointment: any, pet: Pet, onSetAppointment: (formData: any) => void }) => {
  const { petServices } = useShallowPets()
  const services = petServices(pet._id)
  const navigation = useNavigation()
 
  const renderAptDate = (
    <DateInput date={appointment?.date ?? new Date()} onChangeDate={(selected: Date) => {
      onSetAppointment({ ...appointment, date: selected })
    }} />
  )

  const PetService = () => (
    <View>
      { appointment?.vet ?
        <View style={Spacing.flexColumn}>
          {/* <Text>{appointment.vet.name}</Text>
          <Text>{appointment.vet.address}</Text>
          <Text>{appointment.vet.email}</Text>
          <Text>{appointment.vet.phone}</Text> */}
        </View>
      : <ModalInput label={'No vet added.'} onReset={() => onSetAppointment({ ...appointment, vet: null })}>
        { services.length > 0 ? <Dropdown width='70%' dataArray={services} onSelect={(selected) => {
            onSetAppointment({ ...appointment, vet: selected })
          }}/>
          : <ModalInput label='Add Vet' height='93%'>
            <ServiceForm />
          </ModalInput>  
        }
      </ModalInput>
      }
    </View>
  )

  const renderCompleted = (
    <Text>Not completed</Text>
  )

  const formData = [
    { key: 'date', icon: 'schedule', value: renderAptDate },
    { key: 'vet', icon: 'vet', value: <PetService /> },
    { key: 'completed', icon: 'check', value: renderCompleted },
  ]

  return (
    <TableForm table={formData} />
  )
}

const VisitForm = ({ initialValues, pet, onSubmit }: Props) => {
  const initialState = {
    dueDate: initialValues?.dueDate ?? new Date(),
    overDue: initialValues?.overdue ?? false,
    appointment: initialValues?.appointment ?? null,
    notes: initialValues?.notes ?? null,
    _id: initialValues?._id ?? null,
  }
  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { dueDate, overDue, appointment, notes } = values

  const renderDueDate = (
    <DateInput date={dueDate} onChangeDate={(selected: Date) => onChange('dueDate', selected)} buttonTextStyles={dueDate < new Date() && { color: Colors.red.darkest }} />
  )

  const renderAppointment = (
    <ModalInput label={appointment?.vet?.name ?? 'No appointment scheduled.'} onReset={() => onChange('appointment', null)}>
      <AppointmentForm appointment={appointment} pet={pet} onSetAppointment={(formData) => onChange('appointment', formData)} />
    </ModalInput>
  )

  const renderNotes = (
    <NoteInput notes={notes} onChange={(text: string) => onChange('notes', text)} buttonStyles={{ maxWidth: '80%' }} />
  )

  const formData = [
    { key: 'dueDate', icon: 'due', value: renderDueDate },
    { key: 'appointment', icon: 'schedule', value: renderAppointment },
    { key: 'noteSquare', icon: 'note', value: renderNotes },
  ]

  function handleSubmit() {
    onSubmit({ dueDate, overDue, appointment, notes })
  }
  return (
    <TableForm table={formData} />
  )
}

const styles = StyleSheet.create({
  
})

export default VisitForm