//npm modules
import { useState } from "react"
import { View, TextInput, Text, Pressable, StyleSheet, Image } from "react-native"
//components
import PetForm from "../components/PetForm"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import { Pet } from "../services/petsService"

interface EditPetProps {
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ route }) => {
  const { pet } = route.params
  
  const initialValues: {
    name: string, age: number, species: string, breed: string, photo: string | null 
  } = {
    name: pet.name, age: pet.age, species: pet.species, breed: pet.breed, photo: pet.photo ? pet.photo : null
  }

  const handleEditPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    
  }

  return ( 
    <PetForm onSubmit={handleEditPet} initialValues={initialValues} />
  )
}

export default EditPetScreen