//npm modules
import { useEffect } from "react"
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageSourcePropType } from "react-native"
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
  cardWidth: number
  navigation: any
}

const PetCard: React.FC<PetCardProps> = ({ pet, currCard, idx, cardWidth, navigation }) => {
  const scale = currCard === idx ? 1 : 0.9
  const dynamicStyle = {
    ...styles.base,
    opacity: currCard === idx ? 1 : 0.5,
    width: cardWidth,
    height: cardWidth * 1.1, 
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

      <Image source={{uri: pet.photo}} style={[styles.petPhoto, {backgroundColor: pet.photo ? '' : Colors.lightPink}]}/>
      
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.mainBtn}>
          <Text style={styles.btnText}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subBtn} onPress={() => navigation.navigate('Edit', { pet })}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
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
    ...Forms.photo,
    borderRadius: 100
  },
  btnContainer: {
    ...Spacing.flexRow,
    width: '90%',
    justifyContent: 'space-between'
  },
  mainBtn: {
    ...Buttons.xSmallRounded,
    backgroundColor: Colors.green
  },
  subBtn: {
    ...Buttons.xSmallRounded,
    backgroundColor: Colors.yellow
  },
  btnText: {
    ...Buttons.buttonText
  },
})
 
export default PetCard