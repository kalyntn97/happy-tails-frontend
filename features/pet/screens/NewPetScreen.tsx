//npm modules
import { useState } from "react"
import { View } from "react-native"
//queries & store
import { useAddPet } from "../petQueries"
//components
import PetForm from "../components/PetForm"
//utils
import { PetFormData, PhotoFormData } from "@pet/PetInterface"
//styles
import { Colors, Spacing } from "@styles/index"

const NewPetScreen = ({ navigation }) => {
  const [color, setColor] = useState<number>(0)
  
  const addPetMutation = useAddPet(navigation)

  const handleAddPet = async (formData: PetFormData, photoData: PhotoFormData) => {
    addPetMutation.mutate({ formData, photoData })
  }

  return ( 
    <View style={[Spacing.fullCon(), { backgroundColor: Colors.multi.lightest[color] }]}>
      <PetForm onSubmit={handleAddPet} navigation={navigation} formStatus={addPetMutation.status} setColor={setColor} />
    </View>
  )
}

export default NewPetScreen