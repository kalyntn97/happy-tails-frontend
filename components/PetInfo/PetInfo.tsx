import { Image, StyleSheet, Text, View } from "react-native"
import { getPetIconSource } from "@utils/ui"
import { Spacing, UI, Typography, Colors } from '@styles/index'
import { countYearsBetween } from "@utils/datetime"

interface PetInfoProps {
  pet: {
    name: string
    dob?: string,
    firstMet?: string,
    species?: string 
    breed?: string
    photo?: string | null
  }
  size: 'compact' | 'expanded' | 'small' | 'mini'
}

const PetInfo: React.FC<PetInfoProps> = ({ pet, size }) => {
  const iconSource = getPetIconSource(pet.species)
  const petAge = countYearsBetween(pet.dob, 'today')

  return ( 
    <View style={[styles.container, 
      size === 'mini' ? { width: 40, height: 40 } 
      : size === 'small' ? { width: 60, height: 85 } 
      : size === 'compact' ? { width: 90, height: 120 }
      : { ...Spacing.flexRow, height: 120 }
    ]}>
      <View style={size === 'expanded' ? styles.photoContainerExpanded : styles.photoContainerCompact}>
        {size === 'expanded' && 
          <Image source={iconSource} style={styles.petIcon } />
        }
        <Image 
          source={pet.photo ? {uri: pet.photo} : pet.species && getPetIconSource(`${pet.species}Profile`)} 
          style={[
            styles.petPhoto , 
            size === 'expanded' ? {...UI.smallPhoto} 
            : size === 'compact' ? {...UI.xSmallPhoto} 
            : size === 'small' ? {...UI.xxSmallPhoto} 
            : {...UI.tinyPhoto}
          ]} />
        {(size === 'compact' || size === 'small' ) &&
          <Text style={styles.shortName}>{pet.name.split(' ')[0]}</Text>
        }
      </View>
      {size === 'expanded' && 
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.body}>{!!petAge && petAge} {!!petAge && (petAge !== 1 ? 'years old' : 'year old')} {pet.breed}</Text>
          <View style={styles.details}>
          </View>
        </View>}
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    // ...Spacing.centered,
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
    backgroundColor: Colors.shadow.lightest
  },
  petIcon: {
    ...UI.icon,
    position: 'absolute',
    top: '60%',
    left: '-7%',
    zIndex: 1,
  },
  infoContainer: {
    width: '60%',
    height: '100%',
    ...Spacing.flexColumn,
  },
  name: {
    ...Typography.mediumHeader,
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