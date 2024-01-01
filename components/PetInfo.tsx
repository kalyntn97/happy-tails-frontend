import { Image, StyleSheet, Text, View } from "react-native"
import { Pet } from "../services/petsService"
import { getIconSource } from "../utils/petUtils"
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface PetInfoProps {
  pet: Pet
}

const PetInfo: React.FC<PetInfoProps> = ({ pet }) => {
  const iconSource = getIconSource(pet.species)

  return ( 
    <View style={styles.container}>
      <View style={styles.petPhotoContainer}>
        <Image source={iconSource} style={styles.petIcon} />
        <Image source={{uri: pet.photo}} style={styles.petPhoto}/>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}</Text>
        <View style={styles.details}>
          <Text style={styles.body}>{pet.age} {pet.age == 1 ? 'year' : 'years'} old {pet.breed}</Text>
        </View>
      </View>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH,
    ...Spacing.flexRow
  },
  petPhotoContainer: {
    width: '40%',
    height: '100%',
    justifyContent: 'center'
  },
  petPhoto: {
    ...Forms.smallPhoto,
    position: 'relative',
    margin: 10,
    backgroundColor: Colors.lightPink
  },
  petIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: '60%',
    left: '-5%',
    zIndex: 1,
  },
  infoContainer: {
    width: '50%',
    height: '100%',
    ...Spacing.flexColumn,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  name: {
    ...Typography.subHeader,
    fontSize: 20,
    padding: 10,
    margin: 0
  },
  details: {
    ...Spacing.flexRow,
    width: '100%'
  },
  body: {
    ...Typography.body
  }
})

export default PetInfo