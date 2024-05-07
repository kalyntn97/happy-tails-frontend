//npm
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Id, IdFormData } from '@pet/PetInterface'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { MainButton, TransparentButton } from '@components/ButtonComponent'
//styles
import { Colors, Typography, Spacing, Forms } from '@styles/index'
import { styles } from '@styles/FormStyles'
import { getPetIconSource } from '@utils/ui'
import { CircleIcon } from '@components/UIComponents'

interface IdFormProps {
  onSubmit: (type: string, idFormData: IdFormData) => void
}

const IdForm : FC<IdFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>(null)
  const [allowManualName, setAllowManualName] = useState<boolean>(false)
  const [type, setType] = useState<string>(null)
  const [no, setNo] = useState<string>(null)
  const [notes, setNotes] = useState<string>(null)
  const [errorMsg, setErrorMsg] = useState<string>(null)
  
  const handleSelectType = (item: string) => {
    if (item === 'Others') {
      setName(null)
      setAllowManualName(true)
    } else {
      setAllowManualName(false)
      setName(item)
    }
  }

  const handleSave = () => {
    if (!name || !type || !no )  {
      setErrorMsg('Please enter all required fields') 
    } else {
      setErrorMsg(null)
      onSubmit('id', { name, type, no, notes })
    }
  }

  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getPetIconSource('petIdTag')} />
      <Text style={{ ...Typography.errorMsg }}>{errorMsg}</Text>
      <View style={[styles.labelCon, { marginTop: 0 }]}>
        <Text>ID type</Text>
        <Text>Registry name</Text>
      </View>
      <View style={styles.rowCon}>
        <Dropdown label='Select ID type' dataType='petIds' onSelect={handleSelectType} width={140} />
        <TextInput 
          style={[styles.input, styles.rightInput]}
          placeholder='Enter registry name'
          placeholderTextColor={Colors.shadow.reg}
          value={name}
          onChangeText={(text: string) => setName(text)}
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
        <TransparentButton title='Cancel' size='small' />
      </View>
    </View>
  )
}

export default IdForm
