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
  const [color, setColor] = useState<number>(0)
  
  const addPetMutation = useAddPet(navigation)

  const handleAddPet = async (formData: PetFormData, photoData: PhotoFormData) => {
    addPetMutation.mutate({ formData, photoData })
  }

  return ( 
    <ScrollScreen bgColor={Colors.multi.lightest[color]}>
      <PetForm onSubmit={handleAddPet} navigation={navigation} formStatus={addPetMutation.status} setColor={setColor} />
    </ScrollScreen>
  )
}

export default NewPetScreen