//npm
import { FC, useEffect, useState } from 'react'
import { InputModeOptions, Pressable, Text, TextInput, View } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//components
import { ActionButton } from '@components/ButtonComponents'
//styles
import { Spacing, Colors, UI } from '@styles/index'
import { windowWidth } from '@utils/constants'
import { FormInput } from './UIComponents'

type MultipleInputsProps = {
  initials?: any[]
  inputName: string,
  inputMode?: InputModeOptions,
  type: 'date' | 'text'
  onEdit: React.Dispatch<React.SetStateAction<any[]>>
  width?: number
}

const MultipleInputs: FC<MultipleInputsProps> = ({ initials, inputName, inputMode = 'text', type, onEdit, width = windowWidth * 0.8 }) => {
  const [inputs, setInputs] = useState<any[]>(initials ?? [])
  const handleAddInput = () => {
    setInputs(prev => {
      let updatedInputs = type === 'date' ? [...prev, new Date()] : [...prev, '']
      onEdit(updatedInputs)
      return updatedInputs
    })
  }

  const handleRemoveInput = (val: string) => {
    setInputs((prev) => {
      let updatedInputs = prev.filter(v => v !== val)
      onEdit(updatedInputs)
      return updatedInputs
    })
  }

  const handleUpdateInput = (value: any, index: number) => {
    setInputs(prev => {
      const updatedInputs = prev.map((val, idx) => index === idx ? value : val)
      onEdit(updatedInputs)
        return updatedInputs
    })}
  // useEffect(() => {
  //   if (!initials.length) setInputs(initials)
  // }, [initials])

  return (
    <View style={{ width: width }}>
      {inputs.length > 0 &&
        inputs.map((input, index) =>
          <View style={Spacing.flexRow} key={`${inputName}-${index}`}>
            <ActionButton title='decrease' size='small' onPress={() => handleRemoveInput(input)} />
            <View style={type === 'date' && { marginVertical: 5 }}>
              { type === 'date' ?
                <RNDateTimePicker themeVariant='light' value={new Date(input) ?? new Date()} maximumDate={new Date()} accentColor={Colors.pink.dark} onChange={(_, selectedDate) => handleUpdateInput(selectedDate, index)} />
              : type === 'text' ?
                <FormInput 
                  value={input}
                  placeholder={`Enter ${inputName}`}
                  onChange={(text: string) => handleUpdateInput(text, index)}
                  props={{ inputMode: inputMode }}
                />
              : null }
            </View>
          </View>
        )
      }
      <View style={{ ...Spacing.flexRow, marginVertical: 10 }}>
        <ActionButton title={'increase'} size='small' onPress={handleAddInput} />
        <Text>add {inputName}</Text>
      </View>
    </View>
  )
}

export default MultipleInputs
