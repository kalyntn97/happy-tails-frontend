//npm modules
import { useState } from "react"
//queries & store
import { useAddPet } from "../petQueries"
//components
import PetForm from "../components/PetForm"
import { ScrollScreen } from "@components/UIComponents"
//utils
import { PetFormData, PhotoFormData } from "@pet/PetInterface"
//styles
import { Colors } from "@styles/index"

const NewPetScreen = ({ navigation }) => {
  const addPetMutation = useAddPet(navigation)

  const handleAddPet = async (formData: PetFormData, photoData: PhotoFormData) => {
    addPetMutation.mutate({ formData, photoData })
  }

  return ( 
    <PetForm onSubmit={handleAddPet} navigation={navigation} formStatus={addPetMutation.status} />
  )
}

export default NewPetScreen