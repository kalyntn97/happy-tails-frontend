
//npm modules
import { useEffect } from "react"
import { View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//components
import PetForm from "../components/PetForm"
import { InitialFormData, InitialPet, InitialPetValues, Pet, PetFormData, PetMutationFormData, PhotoFormData } from "@pet/PetInterface"
import Loader from "@components/Loader"
//store & queries
import { useUpdatePet } from "@pet/petQueries"
import { usePetActions } from "@store/store"
import { AlertForm } from "@utils/ui"


interface EditPetProps {
  navigation: any
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ navigation, route }) => {
  const { pet } = route.params
  const updatePetMutation = useUpdatePet()

  const { onUpdatePet } = usePetActions()

  const isFocused = useIsFocused()

  const initialValues: InitialPetValues = {
    name: pet.name, species: pet.species, breed: pet.breed, dob: pet.dob, firstMet: pet.firstMet, altered: pet.altered, status: pet.status, color: pet.color, photo: pet.photo ? pet.photo : null, petId: pet._id
  }

  const savedPetInfo = { name: initialValues.name, photo: initialValues.photo }

  const updateGlobalPetInfo = (pet: Pet) => {
    onUpdatePet(pet)
  }

  const handleEditPet = async ({ name, species, breed, dob, firstMet, altered, status, color }: InitialPet , photoData: PhotoFormData, petId: string)  => {
    updatePetMutation.mutate({ name, species, breed, dob, firstMet, altered, status, color, photoData, petId }, {
      onSuccess: (data) => {
        console.log(data)
        if (data.name !== savedPetInfo.name || data.photo !== savedPetInfo.photo) {
          updateGlobalPetInfo(data)
        }
        navigation.navigate('Details', { screen: 'Index', params : { pet: data } })
        return AlertForm({ body: 'Pet updated successfully', button: 'OK' })
      }, 
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      }
    })
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
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