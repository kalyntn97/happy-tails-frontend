//components
import Loader from "@components/Loader"
import PetForm from "../components/PetForm"
//hooks & queries & utils
import { Pet, PetFormData, PhotoFormData } from "@pet/PetInterface"
import { useUpdatePet } from "@pet/petQueries"
import { showToast } from '@utils/misc'

interface EditPetProps {
  navigation: any
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ navigation, route }) => {
  const { pet } = route.params
  const updatePetMutation = useUpdatePet(navigation)

  const initialValues: PetFormData = {
    name: pet.name, species: pet.species, breed: pet.breed, gender: pet.gender, dob: pet.dob, gotchaDate: pet.gotchaDate, altered: pet.altered, status: pet.status, color: pet.color, photo: pet.photo, petId: pet._id
  }

  const handleEditPet = async (formData: PetFormData, photoData: PhotoFormData)  => {
    updatePetMutation.mutate({ formData, photoData })
  }

  return (
    <>
      { pet ?
        <PetForm onSubmit={handleEditPet} initialValues={initialValues} navigation={navigation} isPending={updatePetMutation.isPending} />
        : <Loader />
      }
    </>
  )
}

export default EditPetScreen