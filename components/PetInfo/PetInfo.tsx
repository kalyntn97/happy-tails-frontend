import { DimensionValue, Image, StyleSheet, Text, View } from "react-native"
import { getPetIconSource } from "@utils/ui"
import { Spacing, UI, Typography, Colors } from '@styles/index'
import { countYearsBetween } from "@utils/datetime"
import { Size, photoSizeMap } from "@styles/ui"
import { Icon } from "@components/UIComponents"
import { basePadding } from "@styles/spacing"

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
  const conStyles = size === 'large' ? { ...Spacing.flexRow } : { ...Spacing.flexColumn }

  return ( 
    <View style={conStyles}>
      <View style={[Spacing.flexColumn, { width: UI.iconSizeMap[size] as DimensionValue }]}>
        { size === 'large' && 
          <Icon type='pet' name={pet.species} styles={styles.petIcon} size='med' m={0} />
        }
        <Image 
          source={pet.photo ? {uri: pet.photo} : pet.species && getPetIconSource(`${pet.species}Profile`)} 
          style={[styles.petPhoto, UI.photo(size, 99, 0)]} 
        />
        
        { size === 'med' || size === 'small' &&
          <Text style={styles.shortName}>{pet.name.split(' ')[0]}</Text>
        }
      </View>

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
    ...Typography.smallHeader,
    margin: 0,
    marginTop: 10,
  },
  infoContainer: {
    ...Spacing.flexColumn,
    flex: 1,
    marginLeft: 10,
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
    ...Typography.subHeader,
    margin: 0,
    fontSize: 18,
    textAlign: 'left',
  },
  body: {
    ...Typography.smallSubHeader,
    margin: 0,
    marginTop: 15,
    color: 'gray',
    textAlign: 'left',
  }
})

export default PetInfo