import React, { memo, useCallback, useRef, useState } from 'react'
import { Keyboard, View, ViewStyle } from 'react-native'
//components
import { IconButton } from '@components/ButtonComponents'
import { BottomModal, FormInput } from '@components/UIComponents'
//styles
import { Spacing } from '@styles/index'

type Option = { title: string, icon?: string, type: string }

type Props = {
  selected: string
  options: Option[]
  withCustom?: boolean
  initial?: string
  onSelect: (selected: string) => void
  pickerStyles?: ViewStyle
  buttonStyles?: ViewStyle
  customLabel?: string
  customIcon?: { name: string, type: string }
}

const IconPicker = memo(({ selected, options, withCustom = false, initial, onSelect, pickerStyles, buttonStyles, customLabel = 'value', customIcon }: Props) => {
  const [isCustom, setIsCustom] = useState((initial && !options.some(option => option.title === initial)) ?? false)
  const [modalVisible, setModalVisible] = useState(false)

  const inputRef = useRef(null)

  const getButtonStyles = useCallback(
    (title: string) => ({ 
      ...buttonStyles, width: '30%', 
      opacity: selected === title ? 1 : 0.3 
    }), [buttonStyles, selected])

  const handleSelect = (selected: string) => {
    !options.some(option => option.title === selected) ? setIsCustom(true) : setIsCustom(false)
    onSelect(selected)
  }

  const dismissModal = () => {
    setModalVisible(false)
  } 

  return (
    <View style={[Spacing.flexRowStretch, { flexWrap: 'wrap' }, pickerStyles]}>
      { options.map(option => 
        <IconButton key={option.title} title={option.title} type={option.type} icon={option.icon ?? option.title} size='large' onPress={() => handleSelect(option.title)} buttonStyles={{ ...getButtonStyles(option.title) as ViewStyle }} />
      ) }
      { withCustom &&
        <>
          { customIcon && <IconButton title={isCustom ? selected : 'Others'} type={customIcon.type} icon={customIcon.name} size='large' onPress={() => {
            setIsCustom(true)
            onSelect('Others')
            setModalVisible(!modalVisible)
          }} buttonStyles={{ ...getButtonStyles(isCustom ? selected : 'Others') as ViewStyle }} 
          /> }
          <BottomModal modalVisible={modalVisible} onDismiss={dismissModal} height='70%'>
            <FormInput ref={inputRef} initial={selected !== 'Others' && selected} placeholder={`enter ${customLabel}`} onChange={(input: string) => onSelect(input)} props={{ autoFocus: true, onSubmitEditing: dismissModal, onChange: (e) => onSelect(e.nativeEvent.text) }} width='60%' />
          </BottomModal>
        </>
      }
    </View> 
  )
})

export default IconPicker
