//npm modules
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const HealthIndexScreen = () => {
  return (  
    <View style={styles.container}>
    <Text>All your pet's health info here</Text>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
  }
})
 
export default HealthIndexScreen