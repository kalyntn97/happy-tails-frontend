
//npm modules
import { useEffect } from "react"
import { View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//components
import PetForm from "../components/PetForm"
import { Pet, PetFormData, PhotoFormData } from "@pet/PetInterface"
import Loader from "@components/Loader"
//store & queries
import { useUpdatePet } from "@pet/petQueries"
import { usePetActions } from "@store/store"
import { AlertForm } from "@utils/ui"
import useCustomNavigation from "@hooks/useNavigation"


interface EditPetProps {
  navigation: any
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ navigation, route }) => {
  const { pet } = route.params
  const updatePetMutation = useUpdatePet(navigation)
  const { goBack } = useCustomNavigation()

  const { onUpdatePet } = usePetActions()

  const isFocused = useIsFocused()

  const initialValues: PetFormData = {
    name: pet.name, species: pet.species, breed: pet.breed, dob: pet.dob, firstMet: pet.firstMet, altered: pet.altered, status: pet.status, color: pet.color, photo: pet.photo, petId: pet._id
  }

  const savedPetInfo = { name: initialValues.name, photo: initialValues.photo }

  const updateGlobalPetInfo = (pet: Pet) => {
    onUpdatePet(pet)
  }

  const handleEditPet = async (formData: PetFormData, photoData: PhotoFormData)  => {
    updatePetMutation.mutate({ formData, photoData }, {
      onSuccess: (data) => {
        if (data.name !== savedPetInfo.name || data.photo !== savedPetInfo.photo) {
          updateGlobalPetInfo(data)
        }
      }
    })
  }

  useEffect(() => {
    if (!isFocused) {
      goBack()
    }
  }, [navigation, isFocused])

  return (
    <View style={{flex: 1}}>
      { pet ?
        <PetForm onSubmit={handleEditPet} initialValues={initialValues} navigation={navigation} formStatus={updatePetMutation.status} />
        : <Loader />
      }
    </View>
  )
}

export default EditPetScreen