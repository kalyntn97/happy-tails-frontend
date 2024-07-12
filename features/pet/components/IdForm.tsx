//npm
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import { DetailType, Id, IdFormData } from '@pet/PetInterface'
//components
import Dropdown from '@components/Dropdown/Dropdown'
import { MainButton, TransparentButton } from '@components/ButtonComponent'
//styles
import { Colors, Typography, Spacing, UI } from '@styles/index'
import { styles } from '@styles/stylesheets/FormStyles'
import { getPetIconSource } from '@utils/ui'
import { CircleIcon, ErrorMessage } from '@components/UIComponents'
import { IDS } from '@pet/petHelpers'
import useForm from '@hooks/useForm'

interface IdFormProps {
  initialValues?: IdFormData
  onSubmit: (type: 'ids', idFormData: IdFormData) => void
}

const IdForm : FC<IdFormProps> = ({ initialValues, onSubmit }) => {
  const initialState = { name: initialValues?.name ?? null, allowManualType: initialValues ? !IDS.includes(initialValues.type) : true, type: initialValues?.type ?? null, no: initialValues?.no ?? null, notes: initialValues?.notes ?? null, errorMsg: false }

  const { values, onChange, onValidate, onReset } = useForm(handleSubmit, initialState)

  const { name, allowManualType, type, no , notes, errorMsg } = values
  
  const handleSelectType = (item: string) => {
    if (item === 'Others') {
      onChange('type', null)
      onChange('allowManualType', true)
    } else {
      onChange('type', item)
      onChange('allowManualType', false)
    }
  }

  function handleSubmit() {
    onSubmit('ids', { name, type, no, notes })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add an ID</Text>
      <CircleIcon iconSource={getPetIconSource('ids')} />
      <View style={[styles.labelCon, { marginTop: 20 }]}>
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
          onChangeText={(text: string) => onChange('name', text)}
        />
      </View>
      <View style={styles.labelCon}>
        {allowManualType && <Text>ID type</Text>}
        <Text>Notes (optional)</Text>
      </View>
      <View style={styles.rowCon}>
        {allowManualType && 
          <TextInput 
            style={[styles.input, styles.leftInput]}
            placeholder='Enter ID type'
            placeholderTextColor={Colors.shadow.reg}
            value={type}
            onChangeText={(text: string) => onChange('type', text)}
          />
        }
        <TextInput 
          style={[styles.input, allowManualType && styles.rightInput]}
          placeholder='Enter notes'
          placeholderTextColor={Colors.shadow.reg}
          value={notes}
          onChangeText={(text: string) => onChange('notes', text)}
        />
      </View>
      <Text style={styles.label}>ID number</Text>
        <TextInput 
          style={styles.input}
          placeholder='Enter ID no.'
          placeholderTextColor={Colors.shadow.reg}
          value={no}
          onChangeText={(text: string) => onChange('no', text)}
        />

      {errorMsg && <ErrorMessage error={errorMsg} top={20} />}
      <View style={[styles.btnCon, { marginTop: errorMsg ? 0 : 40 }]}>
        <MainButton title='Submit' size='small' onPress={() => onValidate(name, type, no)} />
        <TransparentButton title='Cancel' size='small' onPress={onReset}/>
      </View>
    </View>
  )
}

export default IdForm
