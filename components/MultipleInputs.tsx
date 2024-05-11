//npm
import { FC, useEffect, useState } from 'react'
import { InputModeOptions, Text, TextInput, View } from 'react-native'
import RNDateTimePicker from '@react-native-community/datetimepicker'
//components
import { ActionButton } from '@components/ButtonComponent'
//styles
import { Spacing, Colors } from '@styles/index'
import { styles } from '@styles/FormStyles'

type MultipleInputsProps = {
  initials?: any[]
  inputName: string,
  inputMode?: InputModeOptions,
  type?: string
  onEdit: React.Dispatch<React.SetStateAction<any[]>>
  width?: number
}

const MultipleInputs: FC<MultipleInputsProps> = ({ initials, inputName, inputMode, type, onEdit, width }) => {
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

  useEffect(() => {
    if (!initials.length) setInputs(initials)
  }, [initials])

  return (
    <View style={{ width: width ?? 300 }}>
      {inputs.length > 0 &&
        inputs.map((input, index) =>
          <View style={{ ...Spacing.flexRow }} key={`${inputName}-${index}`}>
            <ActionButton title='decrease' size='small' onPress={() => handleRemoveInput(input)} />
            <View style={type === 'date' && { marginVertical: 5 }}>
              {type === 'date' ?
                <RNDateTimePicker themeVariant='light' value={new Date(input) ?? new Date()} maximumDate={new Date()} accentColor={Colors.pink.dark} onChange={(event, selectedDate) => setInputs(prev => {
                  const updatedInputs = prev.map((val, idx) => index === idx ? selectedDate : val)
                  onEdit(updatedInputs)
                    return updatedInputs
                })} />
              : 
                <TextInput 
                  style={[styles.input, { width: 260 }]}
                  placeholder={`Enter ${inputName}`}
                  placeholderTextColor={Colors.shadow.reg}
                  value={input}
                  onChangeText={(text: string) => setInputs(prev => {
                    const updatedInputs = prev.map((val, idx) => index === idx ? text : val)
                    onEdit(updatedInputs)
                    return updatedInputs
                  })}
                  inputMode={inputMode ?? 'text'}
                />
              }
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
