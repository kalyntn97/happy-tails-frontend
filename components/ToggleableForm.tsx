import { StyleSheet, TouchableOpacity, Text, View, Image, ImageStyle, Pressable } from "react-native"
import { FC, ReactNode, useEffect, useState } from "react"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { getActionIconSource } from "@utils/ui"
import { TransparentButton } from "./ButtonComponents"

interface FormProps {
  title: string
  children: ReactNode
  buttonColor?: string
  buttonBgColor?: string
  buttonSize?: string
  onPress?: () => void
}

const ToggleableForm = ({ title, children, onPress, buttonSize, buttonColor, buttonBgColor }: FormProps) => {
  const [visible, setVisible] = useState(false)

  const handlePress = () => {
    onPress && onPress()
    setVisible(!visible)
  }
  
  return (
    <View style={styles.container}>
      <TransparentButton title={title} onPress={handlePress} icon='down' color={buttonColor} bgColor={buttonBgColor} size={buttonSize} />
      {visible && children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
})
 
export default ToggleableForm