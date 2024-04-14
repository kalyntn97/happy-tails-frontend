//npm
import { StyleSheet, Text, View, TextInput, Image } from 'react-native'
import React, { FC, useState } from 'react'
//helpers
import { STATS, getUnitKey, statConverter, weightConverter } from '../statHelpers'
//styles
import { Forms, Spacing, Colors, Typography } from '@styles/index'
import Dropdown from '@components/Dropdown/Dropdown'
import { getStatIconSource } from '@utils/ui'
import { useDisplayUnits } from '@store/store'



interface InputFormProps {
  name: string
  initialValues?: { name: string, value: number, date: Date, unit: string }
  onSelect: (item: { name: string, value: number, unit: string }) => void
}

const InputForm: FC<InputFormProps> = ({ name, initialValues, onSelect }) => {
  const [value, setValue] = useState<string>(initialValues?.value.toString() ?? null)
  const displayUnits = useDisplayUnits()
  const unit = displayUnits[getUnitKey(name)]
  
  const convertToDefaultUnit = (value: any) => {
    const converted = unit === STATS[name].unit ? value : statConverter(name, value, unit)
    onSelect({ name: name, value: Number(converted), unit: STATS[name].unit })
  }

  return (
    <View style={styles.container}>
      <View style={{ ...Forms.roundedIconCon }}>
        <Image source={getStatIconSource(name)} />
      </View>
      <Text style={{ ...Typography.mediumHeader }}>{STATS[name].name}</Text>
      <View style={styles.inputCon}>
        <TextInput 
          style={styles.input}
          placeholder='Enter value'
          inputMode='decimal'
          onChangeText={(text: string) => {
            setValue(text)
          }}
          value={(value ?? '').toString()}
          onEndEditing={() => convertToDefaultUnit(value)}
        />
        <Text>{unit}</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
  },
  input: {
    ...Forms.input,
    width: 150,
  },
  inputCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
  },
})

export default InputForm