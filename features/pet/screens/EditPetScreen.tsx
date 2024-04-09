
//npm modules
import { useEffect } from "react"
import { View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//components
import PetForm from "../components/PetForm"
import { Pet } from "@pet/PetInterface"
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

  const initialValues: {
    name: string,  species: string, breed: string, dob: Date, firstMet: Date, altered: { value: boolean, date: Date | null }, status: { value: string, date: Date | null, show: boolean }, color: number, photo: string | null, petId: string 
  } = {
    name: pet.name,  species: pet.species, breed: pet.breed, dob: pet.dob, firstMet: pet.firstMet, altered: pet.altered, status: pet.status, color: pet.color, photo: pet.photo ? pet.photo : null, petId: pet._id
  }

  const savedPetInfo = { name: initialValues.name, photo: initialValues.photo }

  const updateGlobalPetInfo = (pet: Pet) => {
    onUpdatePet(pet)
  }

  const handleEditPet = async (name: string,  species: string, breed: string, dob: Date, firstMet: Date, altered: {value: boolean, date: Date | null}, status: {value: string, date: Date | null, show: boolean }, color: number, photoData: { uri: string, name: string, type: string } | null, petId: string)  => {
    updatePetMutation.mutate({ name, species, breed, dob, firstMet, altered, status, color, photoData, petId }, {
      onSuccess: (data) => {
        if (data.name !== savedPetInfo.name || data.photo !== savedPetInfo.photo) {
          updateGlobalPetInfo(data)
        }
        navigation.navigate('Details', { screen: 'Index', params : { data } })
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