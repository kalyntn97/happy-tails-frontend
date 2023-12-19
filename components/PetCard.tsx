//npm modules
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetCard = ({ pet }) => {
  return ( 
    <View style={styles.container}>
      <Text>{pet.name}</Text>
      <Text>{pet.age}</Text>
      <Text>{pet.breed}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Forms.card,
    width: '90%',
    height: '30%',
  }
})
 
export default PetCard