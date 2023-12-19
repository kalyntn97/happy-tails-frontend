
//npm modules
import { View, Text, StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const NewPetScreen = () => {
  return ( 
    <View style={styles.container}>
      <Text>Add a Pet</Text>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  }
})

export default NewPetScreen