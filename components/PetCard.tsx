//npm modules
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetCard = ({ pet, currCard, idx }) => {
  const getStyle = (currCard, idx) => {
    if (currCard === 0) {
      return styles.first
    } else if (currCard === idx) {
      return styles.focused
    } else if (currCard < idx) {
      return styles.right
    } else if (currCard > idx) {
      return styles.left
    }
  }

  return ( 
    <View style={getStyle(currCard, idx)}>
      <Text>{pet.name}</Text>
      <Text>{pet.age}</Text>
      <Text>{pet.breed}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  first: {
    ...Forms.card,
    width: '90%',
    height: '90%',
  },
  focused: {
    ...Forms.card,
    width: '90%',
    height: '90%',
    transform: [{translateX: -320}]
  },
  left: {
    ...Forms.card,
    width: '90%',
    height: '90%',
    transform: [{translateX: -320}]
  },
  right: {
    ...Forms.card,
    width: '90%',
    height: '90%',
    transform: [{translateX: 300}]
  },
})
 
export default PetCard