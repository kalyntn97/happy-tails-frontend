import { StyleSheet, TouchableOpacity, Text, View, Image, ImageStyle } from "react-native"
import { useState } from "react"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface FormProps {
  title: string
  content: any
}

const ToggleableForm: React.FC<FormProps> = ({ title, content }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainBtn} onPress={() => setIsVisible(!isVisible)}>
        <Image source={require('../assets/icons/dropdownRound.png')} style={styles.icon } />
        <Text style={[styles.btnText, { color: isVisible ? Colors.darkPink : 'black' }]}>{title}</Text>
      </TouchableOpacity>
      {isVisible && content}
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
    margin: 5
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