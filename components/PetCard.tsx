//npm modules
import { useEffect } from "react"
import { StyleSheet, Text, View, Image, ImageSourcePropType } from "react-native"
//types
import { Pet } from "../api/petsService"
//components
import UploadImage from "./UploadImage"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
interface PetCardProps {
  pet: Pet
  currCard: number
  idx: number
  cardWidth: number,
}

const PetCard: React.FC<PetCardProps> = ({ pet, currCard, idx, cardWidth }) => {
  const scale = currCard === idx ? 1 : 0.9
  const dynamicStyle = {
    ...styles.base,
    opacity: currCard === idx ? 1 : 0.5,
    width: cardWidth,
    height: cardWidth, 
    transform: [{ scale }],
  }

  const getIconSource = (species: string): ImageSourcePropType => {
    switch (species) {
      case 'dog':
        return require('../assets/icons/dog.png')
      case 'cat':
        return require('../assets/icons/cat.png')
      case 'bird':
        return require('../assets/icons/bird.png')
      case 'others':
        return require('../assets/icons/animal.png')
    }
  }
  const iconSource = getIconSource(pet.species)
  
  return ( 
    <View style={dynamicStyle}>
      <View style={styles.nameContainer}>
        <Image style={styles.icon} source={iconSource} />
        <Text style={styles.petName}>{pet.name}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.petInfo}>
          <Image style={styles.label} source={require('../assets/icons/birthday.png')} />
          <Text style={styles.body}>{pet.age} {pet.age <= 1 ? 'year' : 'years'} old {pet.breed}</Text>
        </View>
        <View style={styles.petPhoto}>
          <UploadImage pet={pet} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    ...Forms.card,
    justifyContent: 'flex-start',
    backgroundColor: Colors.lightestPink,
    alignItems: 'center',
    marginLeft: 20
  },
  petName: {
    ...Typography.subHeader
  },
  label: {
    width: 25,
    height: 25,
  },
  body: {
    ...Typography.smallBody
  },
  icon: {
    width: 80,
    height: 80,
    // position: 'absolute',
    // top: 0,
    // left: 0,
  },
  nameContainer: {
    ...Spacing.flexRow,
    width: '90%',
    justifyContent: 'flex-start'
  },
  detailsContainer: {
    ...Spacing.flexColumn,
    width: '90%',
  },
  petInfo: {
    ...Spacing.flexRow,
    alignItems: 'center'
  },
  petPhoto: {
    width: 130,
    height: 130,
    borderRadius: 8,
    margin: 5
  }
})
 
export default PetCard