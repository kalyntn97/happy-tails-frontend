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

  useEffect(() => {
    const fetchAllPets = async () => {
      const petData = await petService.index(authState?.token)
      setPets(petData)
    }
    fetchAllPets()
  }, [authState?.token])

  return ( 
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Create')}>
        <Text>Add a Pet</Text>
      </Pressable>
      {pets.map((pet: Pet) => 
        <PetCard key={pet._id} pet={pet} />
      )}
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
})

export default PetIndexScreen