//queries & store
import { useAddPet } from "../petQueries"
//components
import PetForm from "../components/PetForm"
//utils
import { PetFormData, PhotoFormData } from "@pet/PetInterface"

const NewPetScreen = ({ navigation }) => {
  const addPetMutation = useAddPet(navigation)

  const handleAddPet = async (formData: PetFormData, photoData: PhotoFormData) => {
    addPetMutation.mutate({ formData, photoData })
  }

  return ( 
    <PetForm onSubmit={handleAddPet} navigation={navigation} isPending={addPetMutation.isPending} />
  )
}

export default NewPetScreen