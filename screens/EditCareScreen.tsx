//npm
import { StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
//services
import { Care } from "../services/careService"
import { Pet } from "../services/petService"
import * as careService from '../services/careService'

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const { care } = route.params

  const petNames: string[] = care.pets.map(pet => pet.name)

  const initialValues: {
    name: string, frequency: string, times: number, pets: string[]
  } = {
    name: care.name, frequency: care.frequency, times: care.times, pets: petNames
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

  return (  
    <CareForm onSubmit={handleSubmit} initialValues={initialValues} careId={care._id} />
  )
}

export default EditCareScreen