//npm modules
import { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from "react-native"
import { useAuth } from '../context/AuthContext'
//services
import * as petService from '../api/petsService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetsScreen: React.FC = () => {
  const { authState } = useAuth()
  const [pets, setPets] = useState([])

  useEffect(() => {
    const fetchAllPets = async () => {
      const petData = await petService.index(authState?.token)
      setPets(petData)
    }
    fetchAllPets()
  }, [])

  return ( 
    <View style={styles.container}>
      {pets.map((pet, idx) => 
        <Text key={pet.idx}>{pet.name}</Text>
      )}
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
})

export default PetsScreen