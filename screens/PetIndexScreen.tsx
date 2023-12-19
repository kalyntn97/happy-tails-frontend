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

  const handleClick = (e) => {
    if (e.target.innerText === 'Next') {
      setCurrCard(currCard + 1)
    }
  }

  return ( 
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Create')}>
        <Text>Add a Pet</Text>
      </Pressable>
      
      {pets.map((pet, i) =>
        <PetCard key={pet._id} pet={pet} />
      )}
      <View style={styles.dotNav}>
        {pets.map((pet, i) => 
          <Text 
            key={i}
            style={currCard === i ? styles.active : styles.inactive } 
            onPress={() => setCurrCard(i)}>
              .
          </Text>
        )}
      </View>
      <Pressable onPress={(e) => handleClick}>
        <Text>Next</Text>  
      </Pressable>
      
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  dotNav: {

  },
  active: {
    color: 'red'
  },
  inactive: {

  }
})

export default PetIndexScreen