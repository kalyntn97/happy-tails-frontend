import { Image, ImageStyle, StyleSheet, Text, View } from "react-native"
import { Pet } from "../services/petService"
import { getIconSource } from "../utils/petUtils"
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import { fullWH } from "../styles/spacing"

interface PetInfoProps {
  pet: Pet
  size: 'compact' | 'expanded' | 'small'
}

const PetInfo: React.FC<PetInfoProps> = ({ pet, size }) => {
  const iconSource = getIconSource(pet.species)

  return ( 
    <View style={styles.container}>
      <View style={size === 'expanded' ? styles.photoContainerExpanded : styles.photoContainerCompact}>
        {size === 'expanded' && 
          <Image source={iconSource} style={styles.petIcon as ImageStyle} />
        }
        <Image source={pet.photo ? {uri: pet.photo} : require('../assets/icons/pet-profile.png')} style={[styles.petPhoto as ImageStyle, size === 'expanded' ? {...Forms.smallPhoto} : size === 'compact' ? {...Forms.xSmallPhoto} : {...Forms.tinyPhoto}]} />
        {(size === 'compact' || size === 'small' ) &&
          <Text style={styles.shortName}>{pet.name.split(' ')[0]}</Text>
        }
      </View>
      {size === 'expanded' && 
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <View style={styles.details}>
            <Text style={styles.body}>{pet.age} {pet.age && (pet.age !== 1 ? 'years old' : 'year old')} {pet.breed}</Text>
          </View>
        </View>}
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenAcross
  },
  shortName: {
    ...Typography.xSmallHeader,
    margin: 0,
    height: '30%'
  },
  photoContainerExpanded: {
    width: '40%',
    height: '100%',
    justifyContent: 'center'
  },
  photoContainerCompact: {
    width: '100%',
    height: '70%',
    alignItems: 'center'
  },
  petPhoto: {
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