//npm modules
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const CareIndexScreen = () => {
  return (
    <View style={styles.container}>
      <Text>All your pets' care here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
  }
})
 
export default CareIndexScreen