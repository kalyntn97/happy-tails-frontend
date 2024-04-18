//npm
import { FC, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//components
import { RoundButton  } from '@components/ButtonComponent'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

type MultipleInputsProps = {
  initials?: any[]
  type: string
  label: string
  onPress: React.Dispatch<React.SetStateAction<any[]>>
  width?: number
}

const MultipleInputs: FC<MultipleInputsProps> = ({ initials, type, label, onPress, width }) => {
  const [inputs, setInputs] = useState<any[]>(initials ?? [])
  const [selected, setSelected] = useState<any>(type === 'Date' && new Date())

  const customSortArray = (array: any[]) => {
    return array.sort((a, b) => type ==='Date' ? new Date(b).getTime() - new Date(a).getTime() : b - a)
  }

  const handleAddInput = () => {
    setInputs((prev) => {
      let updatedInputs = [selected, ...inputs]
      updatedInputs = customSortArray(updatedInputs)
      onPress(updatedInputs)
      return updatedInputs
    })
  }

  const handleRemoveInput = (val: string) => {
    setInputs((prev) => {
      let updatedInputs = prev.filter(v => v !== val)
      updatedInputs = customSortArray(updatedInputs)
      onPress(updatedInputs)
      return updatedInputs
    })
  }

  return (
    <View style={{ width: width ?? 250 }}>
      <View style={styles.rowCon}>
        {type === 'Date' ?
          <RNDateTimePicker themeVariant='light' value={selected ?? new Date()} maximumDate={new Date()} accentColor={Colors.pink.dark} onChange={(event, selectedDate) => setSelected(selectedDate)} />
        : <TextInput 
            style={[Forms.inputBase, { width: 100 }]}
            placeholder={label}
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setSelected(text)} 
            value={selected} 
          />
        }
        <RoundButton onPress={() => handleAddInput()} size='medium' type='add' />
      </View>

      {inputs.length > 0 ?
        <View style={styles.rowCon}>
          {inputs.map((val: string, index: number) =>
            <View style={styles.initial} key={index}>
              <Text>{ type === 'Date' ? new Date(val).toLocaleDateString() : val }</Text>
              <RoundButton onPress={() => handleRemoveInput(val)} size='small' type='remove' />
            </View>
          )}
        </View>
      : <Text style={styles.empty}>Nothing added. Press + to add and - to remove</Text>} 
    </View>
  )
}

const styles = StyleSheet.create({
  rowCon : {
    ...Spacing.flexRow,
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginVertical: 7,
    width: '100%',
  },
  initial: {
    ...Spacing.flexRow,
    marginVertical: 10,
  },
  label: {
    fontSize: 15,
  },
  empty: {
    ...Typography.xSmallSubBody,
    margin: 0,
    textAlign: 'center',
  },
})

export default MultipleInputs
