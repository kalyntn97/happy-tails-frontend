//npm modules
import { useState } from "react"
import { View, TextInput, Text, Pressable, StyleSheet, Image } from "react-native"
//components
import PetForm from "../components/PetForm"
import { Pet } from "../services/petService"
//context
import { usePetContext } from "../context/PetContext"

interface EditPetProps {
  navigation: any
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ navigation, route }) => {
  const { pet } = route.params
  const { onEditPet } = usePetContext()

  const initialValues: {
    name: string, age: number, species: string, breed: string, photo: string | null, petId: string 
  } = {
    name: pet.name, age: pet.age, species: pet.species, breed: pet.breed, photo: pet.photo ? pet.photo : null, petId: pet._id
  }

  const handleEditPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null)  => {
    const result = await onEditPet!(name, age, species, breed, photoData, pet._id)
    console.log('result', result)

    if (result && result.error) {
      alert(result.msg)
    }
    navigation.navigate('Details', {petId: pet._id})
  }

  return ( 
    <PetForm onSubmit={handleEditPet} initialValues={initialValues} />
  )
}

export default EditPetScreen