import { ReactNode, useState } from "react"
import { View, ViewStyle } from "react-native"
//styles
import { Spacing } from '@styles/index'
import { ButtonSize, TransparentButton } from "./ButtonComponents"

interface FormProps {
  title: string
  children: ReactNode
  buttonStyles?: ViewStyle
  buttonSize?: ButtonSize
  onPress?: () => void
}

const ToggleableForm = ({ title, children, onPress, buttonSize, buttonStyles }: FormProps) => {
  const [visible, setVisible] = useState(false)

  const handlePress = () => {
    onPress && onPress()
    setVisible(!visible)
  }
  
  return (
    <View style={Spacing.flexColumnStretch}>
      <TransparentButton title={title} onPress={handlePress} icon='down' size={buttonSize} buttonStyles={buttonStyles} />
      {visible && children}
    </View>
  )
}

export default ToggleableForm