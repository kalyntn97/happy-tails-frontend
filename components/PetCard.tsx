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
      <View style={styles.headerContainer}>
        <Text style={styles.petName}>{pet.name}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.petInfo}>
            <Image style={{ width: 50, height: 50 }} source={iconSource} />
            <Text style={styles.body}>{pet.breed}</Text>
          </View>

          <View style={styles.petInfo}>
            <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/birthday.png')} />
            <Text style={styles.body}>{pet.age} {pet.age <= 1 ? 'year' : 'years'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.petPhoto}>
        <UploadImage pet={pet} />
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
  },
  headerContainer: {
    ...Spacing.flexColumn,
    width: '100%'
  },
  petName: {
    ...Typography.subHeader,
    margin: 0,
  },
  detailsContainer: {
    ...Spacing.flexRow,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between'
  },
  petInfo: {
    ...Spacing.flexRow,
    alignItems: 'center',
  },
  body: {
    ...Typography.smallBody
  },
  petPhoto: {
    width: 200,
    height: 200,
    borderRadius: 8,
    margin: 5
  }
})
 
export default PetCard