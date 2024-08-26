import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//helpers &  utils
import { ServiceFormData } from '@pet/PetInterface'
import useForm from '@hooks/useForm'
import { useShallowPets } from '@hooks/sharedHooks'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { FormInput, Icon, NoteInput, ScrollScreen, TableForm } from '@components/UIComponents'
import { Header } from '@navigation/NavigationStyles'
import PetPicker from '@components/Pickers/PetPicker'
//styles
import { styles } from '@styles/stylesheets/FormStyles'
import { Spacing } from '@styles/index'

interface ServiceFormProps {
  initialValues?: ServiceFormData
  onSubmit: (type: 'services', formData: ServiceFormData) => void
  isPending: boolean
} 

interface InitialState extends ServiceFormData {
  errors: any
}

const ServiceForm = ({ initialValues, onSubmit, isPending }: ServiceFormProps) => {
  const { PET_BASICS } = useShallowPets()

  const initialState: InitialState = { 
    name: initialValues?.name ?? null, 
    type: initialValues?.type ?? null, 
    address: initialValues?.address ?? null, 
    email: initialValues?.email ?? null, 
    phones: initialValues?.phones ?? [], 
    notes: initialValues?.notes ?? null,
    pets: initialValues?.pets ?? [PET_BASICS[0]._id],
    errors: {}
  }

  const navigation = useNavigation()

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, type, address, email, phones, notes, pets, errors }: InitialState = values

  function handleSubmit() {
    onSubmit('services', { name, type, address, email, phones, notes, pets })
  }

  function handleValidate() {
    onValidate({ name, phones })
  }
  
  const table = [
    { key: 'type', icon: 'services', value: 
      <Dropdown label='Select type' dataType='serviceTypes' initial={type} onSelect={selected => onChange('type', selected)} width={50} withBorder={false} buttonTextStyles={{ textAlign: 'right' }} />
    },
    { key: 'address', icon: 'address', value: 
      <FormInput initial={address} onChange={(text: string) => onChange('address', text)} placeholder='Enter address' withBorder={false} align='right' props={{ multiline: true }} />
    },
    { key: 'email', icon: 'email', value: 
      <FormInput initial={email} onChange={(text: string) => onChange('email', text)} placeholder='Enter email' withBorder={false} align='right' props={{ inputMode: 'email' }} />
    },
    { key: 'phone', icon: 'phone', value: 
      <FormInput initial={email} onChange={(text: string) => onChange('email', text)} placeholder='Enter email' withBorder={false} align='right' props={{ inputMode: 'tel' }} />
    },
    { key: 'notes', icon: 'note', value: 
      <NoteInput notes={notes} onChange={(text: string) => onChange('notes', text)} />
    },
    { key: 'pets', label: 'Pets', icon: 'pets', value: 
      <PetPicker pets={pets} onSelect={(selected: string[]) => onChange('pets', selected)} mode='multi' /> 
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
    <ScrollScreen props={{ keyboardShouldPersistTaps: 'never' }}>
      <View style={styles.headerCon}>
        <Icon type='pet' name={type && type !== 'Other' ? type : 'services'} size='large' />
        <View style={styles.titleCon}>
          <FormInput initial={initialState.name} placeholder="New Service Name" onChange={(text: string) => onChange('name', text)} styles={styles.title} maxLength={50} props={{ autoCapitalize: 'words', multiline: true, selectTextOnFocus: true }} error={errors?.name} withBorder={false} width='100%' />
        </View>
      </View>

      <TableForm table={table} size='med' />
    </ScrollScreen>
  )
}

export default ServiceForm