import { StyleSheet, TouchableOpacity, Text, View, Image, ImageStyle } from "react-native"
import { useState } from "react"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { getActionIconSource } from "@utils/ui"

interface FormProps {
  visible: string
  title: string
  content: any
}

const ToggleableForm: React.FC<FormProps> = ({ visible, title, content }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.mainBtn}>
        <Text style={[styles.btnText, { color: visible === title ? Colors.pink.dark : 'black' }]}>
          {title}
        </Text>
        <Image source={getActionIconSource('downThin')} style={styles.icon } />
      </View>
      {visible === title && content}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignItems: 'center',
    maxHeight: 500,
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