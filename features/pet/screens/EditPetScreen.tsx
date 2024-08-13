import { useState } from "react"
import { View } from "react-native"
//components
import PetForm from "../components/PetForm"
import Loader from "@components/Loader"
//hooks & queries & utils
import { useUpdatePet } from "@pet/petQueries"
import { Pet, PetFormData, PhotoFormData } from "@pet/PetInterface"
//styles
import { Colors, Spacing } from "@styles/index"


interface EditPetProps {
  navigation: any
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ navigation, route }) => {
  const [color, setColor] = useState<number>(0)

  const { pet } = route.params
  const updatePetMutation = useUpdatePet(navigation)

  const initialValues: PetFormData = {
    name: pet.name, species: pet.species, breed: pet.breed, gender: pet.gender, dob: pet.dob, gotchaDate: pet.gotchaDate, altered: pet.altered, status: pet.status, color: pet.color, photo: pet.photo, _id: pet._id
  }

  const handleEditPet = async (formData: PetFormData, photoData: PhotoFormData)  => {
    updatePetMutation.mutate({ formData, photoData })
  }

  return (
    <View style={[Spacing.fullCon(), { backgroundColor: Colors.multi.lightest[color] }]}>
      { pet ?
        <PetForm onSubmit={handleEditPet} initialValues={initialValues} navigation={navigation} formStatus={updatePetMutation.status} setColor={setColor} />
        : <Loader />
      }
    </View>
  )
}

export default EditPetScreen