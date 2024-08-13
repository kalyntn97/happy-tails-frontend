import { Image, StyleSheet, Text, View } from "react-native"
import { getPetIconSource } from "@utils/ui"
import { Spacing, UI, Typography, Colors } from '@styles/index'
import { countYearsBetween } from "@utils/datetime"
import { Size, photoSizeMap } from "@styles/ui"
import { Icon } from "@components/UIComponents"

interface PetInfoProps {
  pet: {
    name: string
    dob?: string,
    gotchaDate?: string,
    species?: string 
    breed?: string
    photo?: string | null
  }
  size: Size
}

const PetInfo = ({ pet, size }: PetInfoProps) => {
  const petAge = countYearsBetween(pet.dob, 'today')
  const conStyles = size === 'large' ? {...Spacing.flexRow } : { ...Spacing.flexColumn }

  return ( 
    <View style={conStyles}>
      <View style={size === 'large' ? styles.containerExpanded : styles.containerCompact}>
        { size === 'large' && 
          <Icon type='pet' name={pet.species} styles={styles.petIcon} size='med' />
        }
        <Image 
          source={pet.photo ? {uri: pet.photo} : pet.species && getPetIconSource(`${pet.species}Profile`)} 
          style={[styles.petPhoto, UI.photo(size)]} 
        />
      </View>

      { size === 'med' || size === 'small'  &&
        <Text style={styles.shortName}>{pet.name.split(' ')[0]}</Text>
      }

      { size === 'large' && 
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.body}>{!!petAge && petAge} {!!petAge && (petAge !== 1 ? 'years old' : 'year old')} {pet.breed}</Text>
        </View> }
    </View>
  )
}
 
const styles = StyleSheet.create({
  shortName: {
    ...Typography.xSmallHeader,
    margin: 0,
  },
  containerExpanded: {
    width: '40%',
    ...Spacing.centered,
  },
  containerCompact: {
    width: '100%',
    alignItems: 'center'
  },
  infoContainer: {
    ...Spacing.flexColumn,
    ...Spacing.centered,
    width: '60%',
  },
  petPhoto: {
    position: 'relative',
    backgroundColor: Colors.shadow.lightest,
  },
  petIcon: {
    position: 'absolute',
    left: -5,
    bottom: 0,
    zIndex: 1,
  },
  name: {
    ...Typography.mediumHeader,
    fontSize: 18,
    padding: 10,
    margin: 0,
    textAlign: 'left',
  },
  body: {
    ...Typography.xSmallSubHeader,
    marginTop: 0,
    color: 'gray',
    textAlign: 'left',
  }
})

export default PetInfo