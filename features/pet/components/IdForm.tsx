//npm
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Id } from '@pet/PetInterface'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { MainButton, TransparentButton } from '@components/ButtonComponent'
//styles
import { Colors, Typography, Spacing, Forms } from '@styles/index'
import { styles } from '@styles/FormStyles'

interface IdFormProps {
  onSave: (idFormData: Id) => void
  onHide: () => void
}

const IdForm : FC<IdFormProps> = ({ onSave, onHide }) => {
  const [name, setName] = useState<string>(null)
  const [allowManualName, setAllowManualName] = useState<boolean>(false)
  const [registry, setRegistry] = useState<string>(null)
  const [no, setNo] = useState<string>(null)
  const [notes, setNotes] = useState<string>(null)
  const [errorMsg, setErrorMsg] = useState<string>(null)
  
  const handleSelectName = (item: string) => {
    if (item === 'Others') {
      setName(null)
      setAllowManualName(true)
    } else {
      setAllowManualName(false)
      setName(item)
    }
  }

  const handleSave = () => {
    if (!name || !registry || !no )  {
      setErrorMsg('Please enter all required fields') 
    } else {
      setErrorMsg(null)
      onSave({ name, registry, no, notes })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>
      <View style={styles.labelCon}>
        <Text>ID type</Text>
        <Text>Registry name</Text>
      </View>
      <View style={styles.rowCon}>
        <Dropdown label='Select ID type' dataType='petIds' onSelect={handleSelectName} width={140} />
        <TextInput 
          style={[styles.input, styles.rightInput]}
          placeholder='Enter registry name'
          placeholderTextColor={Colors.shadow.reg}
          value={registry}
          onChangeText={(text: string) => setRegistry(text)}
        />
      </View>
      <View style={styles.labelCon}>
        {allowManualName && <Text>ID type</Text>}
        <Text>Notes (optional)</Text>
      </View>
      <View style={styles.rowCon}>
        {allowManualName && <TextInput 
          style={[styles.input, styles.leftInput]}
          placeholder='Enter ID type'
          placeholderTextColor={Colors.shadow.reg}
          value={name}
          onChangeText={(text: string) => setName(text)}
        />}
        <TextInput 
          style={[styles.input, allowManualName && styles.rightInput]}
          placeholder='Enter notes'
          placeholderTextColor={Colors.shadow.reg}
          value={notes}
          onChangeText={(text: string) => setNotes(text)}
        />
      </View>
      <Text style={styles.label}>ID number</Text>
      <TextInput 
          style={styles.input}
          placeholder='Enter ID no.'
          placeholderTextColor={Colors.shadow.reg}
          value={no}
          onChangeText={(text: string) => setNo(text)}
        />

      <View style={styles.btnCon}>
        <MainButton title='Add' size='small' onPress={handleSave} />
        <TransparentButton title='Cancel' size='small' onPress={onHide} />
      </View>
    </View>
  )
}

export default IdForm
