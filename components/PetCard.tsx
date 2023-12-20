//npm modules
import { StyleSheet, Text, View, Image, ImageSourcePropType } from "react-native"
//types
import { Pet } from "../api/petsService"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
interface PetCardProps {
  pet: Pet;
  currCard: number;
  idx: number;
}

const PetCard: React.FC<PetCardProps> = ({ pet, currCard, idx }) => {
  const getStyle = (currCard: number, idx: number) => {
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
  const dynamicStyle = getStyle(currCard, idx)

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
    width: '90%',
    height: '90%',
    justifyContent: 'flex-start',
    backgroundColor: Colors.lightestPink
  },
  baseSmall: {
    ...Forms.card,
    width: '85%',
    height: '85%',
    backgroundColor: Colors.lightestPink,
    opacity: .5
  },
  focused: {
    transform: [{translateX: -300}]
  },
  left: {
    transform: [{translateX: -300}],
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