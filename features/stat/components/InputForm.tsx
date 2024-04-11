//npm
import { StyleSheet, Text, View, TextInput, Image } from 'react-native'
import React, { FC, useState } from 'react'
//helpers
import { STATS, weightConverter } from '../statHelpers'
//styles
import { Forms, Spacing, Colors, Typography } from '@styles/index'
import Dropdown from '@components/Dropdown/Dropdown'
import { getStatIconSource } from '@utils/ui'



interface InputFormProps {
  name: string
  initialValues?: { name: string, value: number, date: Date, unit: string }
  onSelect: (item: { name: string, value: number }) => void
}

const InputForm: FC<InputFormProps> = ({ name, initialValues, onSelect }) => {
  const [value, setValue] = useState<string>(initialValues?.value.toString() ?? null)
  const [unit, setUnit] = useState<string>(initialValues?.unit ?? STATS[name].unit)

  const onChangeUnit = (unit: string) => {
    setUnit(unit)
    const converted = unit === 'lb' ? weightConverter(value, 'lbs') : weightConverter(value, 'kg')
    setValue(converted)
    onSelect({ name: name, value: Number(converted) })
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconCon}>
        <Image source={getStatIconSource(name)} style={{ ...Forms.largeIcon }} />
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
          onEndEditing={() => onSelect({ name: name, value: Number(value) })}
        />
        <Dropdown initial={unit} dataType='weight' onSelect={onChangeUnit} width={70} />
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
  iconCon: {
    borderRadius: 99,
    backgroundColor: Colors.shadow.reg,
    marginVertical: 20,
    padding: 10,
    width: 90,
    height: 90,
    ...Spacing.centered,
  },
})

export default InputForm