import { StyleSheet, TouchableOpacity, Text, View, Image, ImageStyle, Pressable } from "react-native"
import { FC, ReactNode, useState } from "react"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { getActionIconSource } from "@utils/ui"
import { TransparentButton } from "./ButtonComponent"

interface FormProps {
  title: string
  buttonColor?: string
  buttonBgColor?: string
  buttonSize?: string
  content: ReactNode
  onPress?: () => void
}

const ToggleableForm: React.FC<FormProps> = ({ title, content, onPress, buttonSize, buttonColor, buttonBgColor }) => {
  const [visible, setVisible] = useState(false)

  const handlePress = () => {
    onPress && onPress()
    setVisible(!visible)
  }
  
  return (
    <View style={styles.container}>
      <TransparentButton title={title} onPress={handlePress} icon='downThin' color={buttonColor} bgColor={buttonBgColor} size={buttonSize} />
      {visible && content}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainBtn: {
    ...Spacing.flexRow,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Colors.pink.reg,
  },
  btnText: {
    ...Typography.xSmallHeader,
    margin: 0,
    padding: 5,
    alignSelf: 'center',
  },
  icon: {
    ...Forms.xSmallIcon
  },
})
 
export default ToggleableForm