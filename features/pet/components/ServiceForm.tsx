//npm
import { View, Text, TextInput, Pressable } from 'react-native'
import React, { FC, useState } from 'react'
//helpers && types
import { Service, ServiceFormData } from '@pet/PetInterface'
import { getPetIconSource } from '@utils/ui'
//components
import { CircleIcon, ErrorMessage } from '@components/UIComponents'
import { ActionButton, MainButton, TransparentButton } from '@components/ButtonComponent'
import Dropdown from '@components/Dropdown/Dropdown'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Forms, Spacing, Typography } from '@styles/index'
import MultipleInputs from '@components/MultipleInputs'

interface ServiceFormProps {
  initialValues?: { name: string, type: string, address?: string, email?: string, phones?: string[], notes?: string }
  onSubmit: (type: string, formData: ServiceFormData) => void
} 

const ServiceForm: FC<ServiceFormProps> = ({ initialValues, onSubmit }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [type, setType] = useState(initialValues?.type ?? null)
  const [address, setAddress] = useState(initialValues?.address ?? null)
  const [email, setEmail] = useState(initialValues?.email ?? null)
  const [phones, setPhones] = useState(initialValues?.phones ?? [])
  const [notes, setNotes] = useState(initialValues?.notes ?? null)
  const [errorMsg, setErrorMsg] = useState<string>(null)
  
  const handleSave = () => {
    if (!name || !type)  {
      setErrorMsg('Please enter all required fields') 
    } else {
      setErrorMsg(null)
      console.log(phones)
      onSubmit('service', { name, type, address, email, phones, notes })
    }
  }
  

  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getPetIconSource('service')} />
      {errorMsg && <ErrorMessage error={errorMsg} />}
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
          onChangeText={(text: string) => setName(text)}
        />
        <Dropdown label='Select type' dataType='serviceTypes' initial={type} onSelect={setType} width={125} />
      </View>
      <Text style={styles.label}>Address</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter address'
        placeholderTextColor={Colors.shadow.reg}
        value={address}
        onChangeText={(text: string) => setAddress(text)}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter email'
        placeholderTextColor={Colors.shadow.reg}
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        inputMode='email'
      />
      <Text style={styles.label}>Phone</Text>
    
      <MultipleInputs inputName='phone' inputMode='tel' initials={phones} onEdit={setPhones} />
      
      <Text style={styles.label}>Notes</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter notes'
        placeholderTextColor={Colors.shadow.reg}
        value={notes}
        onChangeText={(text: string) => setNotes(text)}
      />
      <View style={styles.btnCon}>
        <MainButton title='Submit' size='small' onPress={handleSave} />
        <TransparentButton title='Cancel' size='small' />
      </View>
    </View>
  )
}

export default ServiceForm