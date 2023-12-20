//npm modules
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetCard = ({ pet, currCard, idx }) => {
  const getStyle = (currCard, idx) => {
    if (currCard === 0) {
      return styles.base
    } else if (currCard === idx) {
      return {...styles.base, ...styles.focused}
    } else if (currCard < idx) {
      return {...styles.baseSmall, ...styles.right}
    } else if (currCard > idx) {
      return {...styles.baseSmall, ...styles.left}
    }
  }

  return ( 
    <View style={getStyle(currCard, idx)}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.label}>Age:
        <Text style={styles.body}> {pet.age}</Text>
      </Text>
      <Text style={styles.label}>Age:
        <Text style={styles.body}> {pet.breed}</Text>
      </Text>
      
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    ...Forms.card,
    width: '90%',
    height: '90%',
    backgroundColor: Colors.lightestPink
  },
  baseSmall: {
    ...Forms.card,
    width: '85%',
    height: '85%',
  },
  focused: {
    transform: [{translateX: -320}]
  },
  left: {
    transform: [{translateX: -320}],
  },
  right: {
    transform: [{translateX: 300}]
  },
  petName: {
    ...Typography.subHeader
  },
  label: {
    ...Typography.smallBody
  },
  body: {
    ...Typography.smallBody
  },
})
 
export default PetCard