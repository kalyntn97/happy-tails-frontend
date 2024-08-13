//npm
import { StyleSheet, Text, View, TextInput, Image } from 'react-native'
import React, { FC, useState } from 'react'
//helpers
import { STATS, getUnitKey, statConverter, weightConverter } from '../statHelpers'
//styles
import { UI, Spacing, Colors, Typography } from '@styles/index'
import Dropdown from '@components/Dropdown/Dropdown'
import { getStatIconSource } from '@utils/ui'
import { useDisplayUnits } from '@store/store'
import NoteForm from './NoteForm'
import { CircleIcon } from '@components/UIComponents'



interface InputFormProps {
  name: string
  initialValues?: { name: string, value: number, notes: string, date: string, unit: string }
  onSelect: (item: { name: string, value: number, unit: string }) => void
}

const InputForm: FC<InputFormProps> = ({ name, initialValues, onSelect }) => {
  const [value, setValue] = useState<string>(initialValues?.value.toString() ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)

  const displayUnits = useDisplayUnits()
  const unit = displayUnits[getUnitKey(name)]
  
  const convertToDefaultUnit = (value: any) => {
    const converted = unit === STATS[name].unit ? value : statConverter(name, value, unit)
    onSelect({ name: name, value: Number(converted), unit: STATS[name].unit })
  }

  return (
    <View style={styles.container}>
      <CircleIcon iconSource={getStatIconSource(name)} />
      <Text style={{ ...Typography.mediumHeader }}>{STATS[name].name}</Text>
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

      <NoteForm onAddNote={setNotes} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    ...Spacing.fullCon(),
    ...Spacing.centered,
  },
  input: {
    width: 100,
  },
  unit: {
    ...Typography.focused, 
    color: Colors.white
  },
  unitCon: {
    backgroundColor: Colors.shadow.reg,
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
    borderColor: Colors.shadow.reg,
    borderRadius: 8,
    height: 40,
    width: 140,
    padding: 10,
    marginTop: 10,
  },
})

export default InputForm