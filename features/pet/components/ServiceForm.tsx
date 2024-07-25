//npm
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import React, { FC, useState } from 'react'
//helpers && types
import { Service, ServiceFormData } from '@pet/PetInterface'
import { getPetIconSource } from '@utils/ui'
//components
import { CircleIcon, ErrorMessage, Header, TopRightHeader } from '@components/UIComponents'
import { ActionButton, MainButton, TransparentButton } from '@components/ButtonComponent'
import Dropdown from '@components/Dropdown/Dropdown'
//styles
import { styles } from '@styles/stylesheets/FormStyles'
import { Colors, UI, Spacing, Typography } from '@styles/index'
import MultipleInputs from '@components/MultipleInputs'
import useForm from '@hooks/useForm'

interface ServiceFormProps {
  initialValues?: ServiceFormData
  onSubmit: (type: 'services', formData: ServiceFormData) => void
} 

const ServiceForm: FC<ServiceFormProps> = ({ initialValues, onSubmit }) => {
  const initialState = { name: initialValues?.name ?? null, type: initialValues?.type ?? null, address: initialValues?.address ?? null, email: initialValues?.email ?? null, phones: initialValues?.phones ?? [], notes: initialValues?.notes ?? null, errorMsg: false }
  
  const [reset, setReset] = useState(false)

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)
  const { name, type, address, email, phones, notes, errorMsg } = values

  function handleSubmit() {
    onSubmit('services', { name, type, address, email, phones, notes })
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title='Add a Service' styles={{ paddingTop: 10 }} />
      <CircleIcon iconSource={getPetIconSource('services')} />
      <View style={styles.labelCon}>
        <Text>Name</Text>
        <Text>Type</Text>
      </View>
      <View style={styles.rowCon}>
        <TextInput 
          style={[styles.input, { width: 170 }]}
          placeholder='Enter name'
          placeholderTextColor={Colors.shadow.reg}
          value={name}
          onChangeText={(text: string) => onChange('name', text)}
        />
        <Dropdown label='Select type' dataType='serviceTypes' initial={type} onSelect={selected => onChange('type', selected)} width={125} />
      </View>
      <Text style={styles.label}>Address</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter address'
        placeholderTextColor={Colors.shadow.reg}
        value={address}
        onChangeText={(text: string) =>  onChange('address', text)}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter email'
        placeholderTextColor={Colors.shadow.reg}
        value={email}
        onChangeText={(text: string) =>  onChange('email', text)}
        inputMode='email'
      />
      <Text style={styles.label}>Phone</Text>
    
      <MultipleInputs inputName='phone' inputMode='tel' initials={phones} onEdit={(inputs) => onChange('phones', inputs)} />
      
      <Text style={styles.label}>Notes</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter notes'
        placeholderTextColor={Colors.shadow.reg}
        value={notes}
        onChangeText={(text: string) => onChange('notes', text)}
      />

      {errorMsg && <ErrorMessage error={errorMsg} top={20} />}
      <View style={[styles.btnCon, { marginTop: errorMsg ? 0 : 40 }]}>
        <MainButton title='Submit' size='small' onPress={() => onValidate(name, type)} />
        <TransparentButton title='Cancel' size='small' onPress={() => { onReset(); setReset(!reset) }} />
      </View>
    </ScrollView>
  )
}

export default ServiceForm