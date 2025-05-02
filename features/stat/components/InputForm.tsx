import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
//helpers
import { useGetDisplayUnits, useSetActions } from '@store/store'
import { STATS, getUnitKey, statConverter } from '../statHelpers'
//components
import { CircleIcon, FormHeader } from '@components/UIComponents'
import NoteForm from './NoteForm'
//styles
import { StackScreenNavigationProp } from '@navigation/types'
import { useNavigation } from '@react-navigation/native'
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { SubButton } from '@components/ButtonComponents'

interface InputFormProps {
  name: string
  initialValues?: { name: string, value: number, notes: string, date: string, unit: string }
  onSelect: (item: { name: string, value: number, notes: string, unit: string }) => void
}

const InputForm = ({ name, initialValues, onSelect }: InputFormProps) => {
  const [value, setValue] = useState<string>(initialValues?.value.toString() ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)

  const navigation = useNavigation<StackScreenNavigationProp>()

  const unitKey = getUnitKey(name)
  const unit = useGetDisplayUnits(unitKey)
  
  const convertToDefaultUnit = (value: any) => {
    const converted = unit === STATS[name].unit ? value : statConverter(name, value, unit)
    onSelect({ name: name, value: Number(converted), notes, unit: STATS[name].unit })
  }

  return (
    <View style={Spacing.fullCon('col', true)}>
      <CircleIcon type='stat' name={name} />
      <FormHeader title={STATS[name].name} size="large" />

      <View style={styles.inputCon}>
        <TextInput 
          style={styles.input}
          placeholder='Enter value'
          placeholderTextColor={Colors.shadow.reg}
          inputMode='decimal'
          onChangeText={(text: string) => {
            setValue(text)
          }}
          value={(value ?? '').toString()}
          onEndEditing={() => convertToDefaultUnit(value)}
        />
        <View style={styles.unitCon}>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>

      <SubButton title='Helper' onPress={() => navigation.navigate('Settings')} size='xSmall' color={UI.lightPalette().focused} />
      <SubButton title='Change unit' onPress={() => navigation.navigate('Settings', { sectionTitle: 'Display Settings' })} size='xSmall' color={UI.lightPalette().unfocused} />

      <NoteForm onAddNote={(text: string) => {
        setNotes(text)
        if (text) onSelect({ name, value: Number(value), notes: text, unit })
      }} />
    </View>
  )
}


const styles = StyleSheet.create({
  input: {
    width: 100,
  },
  unit: {
    ...Typography.focused, 
    color: Colors.white
  },
  unitCon: {
    backgroundColor: Colors.shadow.dark,
    height: 40,
    width: 40,
    ...Spacing.centered,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  inputCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.shadow.dark,
    borderRadius: 8,
    height: 40,
    width: 140,
    padding: 10,
    marginVertical: 10,
  },
})

export default InputForm