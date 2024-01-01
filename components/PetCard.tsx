//npm modules
import { useEffect } from "react"
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageSourcePropType } from "react-native"
//types & utils
import { Pet } from "../services/petsService"
import { getIconSource } from "../utils/petUtils"
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

      <Image source={{uri: pet.photo}} style={styles.petPhoto}/>
      
      <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Details', { petId: pet._id })}>
        <Text style={styles.btnText}>Details</Text>
      </TouchableOpacity>

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
    borderRadius: 100,
    backgroundColor: Colors.lightPink
  },
  mainBtn: {
    ...Buttons.xSmallRounded,
    backgroundColor: Colors.green
  },
  btnText: {
    ...Buttons.buttonText
  },
})
 
export default PetCard