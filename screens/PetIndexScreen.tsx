//npm modules
import { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Pressable } from "react-native"
import { useAuth } from '../context/AuthContext'
//services
import { Pet } from '../api/petsService'
import * as petService from '../api/petsService'
//components
import PetCard from '../components/PetCard'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetIndexScreen: React.FC = ({ navigation }) => {
  const { authState } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [currCard, setCurrCard] = useState<number>(0)
  const [petCount, setPetCount] = useState<number>(0)

  useEffect(() => {
    const fetchAllPets = async () => {
      const petData = await petService.index(authState?.token)
      setPets(petData)
      setPetCount(petData.length)
    }
    fetchAllPets()
  }, [authState?.token])

  const handleClickNext = () => {
    setCurrCard(currCard + 1)
  }
  const handleClickPrev = () => {
    setCurrCard(currCard - 1)
  }

  return ( 
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        {currCard > 0 && 
          <Pressable onPress={handleClickPrev}>
            <Text>Prev</Text>  
          </Pressable>
        }
        {currCard < petCount - 1 && 
          <Pressable onPress={handleClickNext}>
            <Text>Next</Text>  
          </Pressable>
        }
      </View>
      <View style={styles.carousel}>
        {pets.map((pet, i) =>
          <PetCard key={pet._id} pet={pet} idx={i} currCard={currCard}/>
        )}
      </View>
      <View style={styles.dotNav}>
        {pets.map((pet, i) => 
          <Text 
            key={i}
            style={currCard === i ? styles.active : styles.inactive } 
            onPress={() => setCurrCard(i)}>
              •
          </Text>
        )}
      </View>
      <Pressable onPress={() => navigation.navigate('Create')} style={styles.addPetBtn}>
        <Text style={styles.btnText}>Add a Pet</Text>
      </Pressable>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  btnContainer: {
    width: '90%',
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  carousel: {
    width: '90%',
    height: '60%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  dotNav: {
    ...Spacing.flexRow,
    alignItems: 'center',
    width: '90%',
    height: 80,
    padding: 10,
    marginBottom: 10,
  },
  active: {
    fontSize: 50,
    margin: 8,
    lineHeight: 60,
    color: Colors.pink
  },
  inactive: {
    fontSize: 30,
    margin: 10,
    lineHeight: 60,
  },
  addPetBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.darkPink,
    marginTop: 20
  },
  btnText: {
    ...Buttons.buttonText,
    color: Colors.lightestPink
  },
})

export default PetIndexScreen