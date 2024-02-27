import { StyleSheet, TouchableOpacity, Text, View, Image, ImageStyle } from "react-native"
import { useState } from "react"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface FormProps {
  visible: string
  title: string
  content: any
}

const ToggleableForm: React.FC<FormProps> = ({ visible, title, content }) => {
  
  return (
    <View style={styles.container}>
      <View style={styles.mainBtn}>
        <Image source={require('@assets/icons/dropdownRound.png')} style={styles.icon } />
        <Text style={[styles.btnText, { color: visible === title ? Colors.darkPink : 'black' }]}>
          {title}
        </Text>
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
    margin: 5,
    alignSelf: 'flex-start',
  },
  btnText: {
    ...Typography.xSmallHeader,
    margin: 0,
    padding: 5,
    alignSelf: 'center',
  },
  icon: {
    ...Forms.smallIcon
  },
})
 
export default ToggleableForm