import { Image, StyleSheet, Text, View } from "react-native"
import { getPetIconSource } from "@utils/ui"
import { Spacing, Forms, Typography, Colors } from '@styles/index'

interface PetInfoProps {
  pet: {
    name: string
    age?: number
    species?: string 
    breed?: string
    photo: string | null
  }
  size: 'compact' | 'expanded' | 'small' | 'mini'
}

const PetInfo: React.FC<PetInfoProps> = ({ pet, size }) => {
  const iconSource = getPetIconSource(pet.species)

  return ( 
    <View style={styles.container}>
      <View style={size === 'expanded' ? styles.photoContainerExpanded : styles.photoContainerCompact}>
        {size === 'expanded' && 
          <Image source={iconSource} style={styles.petIcon } />
        }
        <Image 
          source={pet.photo ? {uri: pet.photo} : require('@assets/icons/pet-profile.png')} 
          style={[
            styles.petPhoto , 
            size === 'expanded' ? {...Forms.smallPhoto} 
            : size === 'compact' ? {...Forms.xSmallPhoto} 
            : size === 'small' ? {...Forms.xxSmallPhoto} 
            : {...Forms.tinyPhoto}
          ]} />
        {(size === 'compact' || size === 'small' ) &&
          <Text style={styles.shortName}>{pet.name.split(' ')[0]}</Text>
        }
      </View>
      {size === 'expanded' && 
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.body}>{pet.age} {pet.age && (pet.age !== 1 ? 'years old' : 'year old')} {pet.breed}</Text>
          <View style={styles.details}>
          </View>
        </View>}
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenAcross,
  },
  shortName: {
    ...Typography.xSmallHeader,
    margin: 0,
    height: '30%'
  },
  photoContainerExpanded: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
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
    top: '55%',
    left: '-7%',
    zIndex: 1,
  },
  infoContainer: {
    width: '60%',
    height: '100%',
    ...Spacing.flexColumn,
  },
  name: {
    ...Typography.subHeader,
    fontSize: 18,
    padding: 10,
    margin: 0,
    width: '100%',
  },
  details: {
    ...Spacing.flexRow,
    width: '100%'
  },
  body: {
    ...Typography.xSmallSubHeader,
    marginTop: 0,
    color: 'gray',
  }
})

export default PetInfo