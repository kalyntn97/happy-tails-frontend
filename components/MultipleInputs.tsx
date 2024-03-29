//npm
import { FC, useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { SmallAddButton, SmallRemoveButton } from '@components/ButtonComponent'

type MultipleInputsProps = {
  initials?: any[]
  type: string
  label: string
  onPress: React.Dispatch<React.SetStateAction<any[]>>
}

const MultipleInputs: FC<MultipleInputsProps> = ({ initials, type, label, onPress }) => {
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
    <View>
      <View style={styles.rowCon}>
        <Text style={styles.label}>{label}</Text>
        {type === 'Date' ?
          <RNDateTimePicker value={selected ?? new Date()} maximumDate={new Date()} accentColor={Colors.darkPink} onChange={(event, selectedDate) => setSelected(selectedDate)} />
        : <TextInput 
            style={[Forms.inputBase, { width: 100 }]}
            placeholder={label} 
            onChangeText={(text: string) => setSelected(text)} 
            value={selected} 
          />
        }
        <SmallAddButton onPress={() => handleAddInput()} />
      </View>

      {inputs.length > 0 &&
        <View style={styles.rowCon}>
          {inputs.map((val: string, index: number) =>
            <View style={styles.initial} key={index}>
              <SmallRemoveButton onPress={() => handleRemoveInput(val)} />
              <Text>
                { type === 'Date' ? new Date(val).toLocaleDateString() : val }
              </Text>
            </View>
          )}
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  rowCon : {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    width: 270,
    marginVertical: 7,
    justifyContent: 'space-evenly'
  },
  initial: {
    ...Spacing.flexRow,
    margin: 5,
  },
  label: {
    fontSize: 15,
  },
})

export default MultipleInputs
