//npm
import { View, Text, TextInput } from 'react-native'
import React, { FC, useState } from 'react'
//helpers && types
import { Service } from '@pet/PetInterface'
import { getPetIconSource } from '@utils/ui'
//components
import { CircleIcon } from '@components/UIComponents'
import { MainButton, TransparentButton } from '@components/ButtonComponent'
import Dropdown from '@components/Dropdown/Dropdown'
//styles
import { styles } from '@styles/FormStyles'
import { Colors, Forms, Spacing, Typography } from '@styles/index'

interface ServiceFormProps {
  initialValues?: { name: string, type: string, address?: string, email?: string, phone?: string, notes?: string }
  onSave: (serviceFormData: Service) => void
} 

const ServiceForm: FC<ServiceFormProps> = ({ initialValues, onSave }) => {
  const [name, setName] = useState<string>(initialValues?.name ?? null)
  const [type, setType] = useState(initialValues?.type ?? null)
  const [address, setAddress] = useState(initialValues?.address ?? null)
  const [email, setEmail] = useState(initialValues?.email ?? null)
  const [phone, setPhone] = useState(initialValues?.phone ?? null)
  const [notes, setNotes] = useState(initialValues?.notes ?? null)
  const [errorMsg, setErrorMsg] = useState<string>(null)
  
  const handleSave = () => {
    if (!name || !type)  {
      setErrorMsg('Please enter all required fields') 
    } else {
      setErrorMsg(null)
      onSave({ name, type, address, email, phone, notes })
    }
  }

  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getPetIconSource('service')} />
      <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>
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
      <View style={styles.labelCon}>
        <Text>Email</Text>
        <Text>Phone</Text>
      </View>
      <View style={styles.rowCon}>
        <TextInput 
          style={[styles.input, { width: 185 }]}
          placeholder='Enter email'
          placeholderTextColor={Colors.shadow.reg}
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          inputMode='email'
        />
        <TextInput 
          style={[styles.input, { width: 110 }]}
          placeholder='Enter phone number'
          placeholderTextColor={Colors.shadow.reg}
          value={phone}
          onChangeText={(text: string) => setPhone(text)}
          inputMode='tel'
        />
      </View>
      <Text style={styles.label}>Notes</Text>
      <TextInput 
        style={styles.input}
        placeholder='Enter notes'
        placeholderTextColor={Colors.shadow.reg}
        value={notes}
        onChangeText={(text: string) => setNotes(text)}
      />
      <View style={styles.btnCon}>
        <MainButton title='Add' size='small' onPress={handleSave} />
        <TransparentButton title='Cancel' size='small' />
      </View>
    </View>
  )
}

export default ServiceForm