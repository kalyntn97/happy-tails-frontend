//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
//services
import { Care } from "../services/careService"
import { Pet } from "../services/petService"
import * as careService from '../services/careService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const { care } = route.params
  const isFocused = useIsFocused()
  const petData = care.pets.map(pet => pet._id)

  const initialValues: {
    name: string, frequency: string, times: number, pets: string[]
  } = {
    name: care.name, frequency: care.frequency, times: care.times, pets: petData
  }

  const handleSubmit = async (name: string, frequency: string, times: number, pets: string[], careId: string) => {
    try {
      const updatedCareCard = await careService.update(name, frequency, times, pets, careId)
      navigation.navigate('Index', { careId: updatedCareCard._id })
    } catch (error) {
      console.log('Error updating a care card', error)
      alert('Error updating tracker. Please try again.')
    }
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (  
    <View style={styles.container}>
      <CareForm onSubmit={handleSubmit} initialValues={initialValues} careId={care._id} />
      <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  },
  subBtn: {
    ...Buttons.smallSub,
  },
})

export default EditCareScreen