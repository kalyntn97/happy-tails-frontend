//npm modules
import { useEffect } from "react"
import { StyleSheet, Text, View, Image, ImageSourcePropType } from "react-native"
//types
import { Pet } from "../api/petsService"
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
    ...(currCard === idx ? styles.focused : ''),
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
        <Image style={styles.petPhoto} source={pet.photo}/>
        <View style={styles.petInfo}>
          <Text style={styles.label}>Age:
            <Text style={styles.body}> {pet.age}</Text>
          </Text>
          <Text style={styles.label}>Breed:
            <Text style={styles.body}> {pet.breed}</Text>
          </Text>
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
    position: 'relative',
  },
  focused: {
    zIndex: 1,
    alignSelf: 'center',
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
    ...Spacing.flexRow,
    width: '90%'
  },
  petInfo: {
    width: '60%'
  },
  petPhoto: {
    width: '40%',
    borderRadius: 8,
    margin: 5
  }
})
 
export default PetCard