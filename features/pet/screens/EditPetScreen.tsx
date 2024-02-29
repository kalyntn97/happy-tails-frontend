//npm modules
import { useEffect } from "react"
import { View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//components
import PetForm from "../components/PetForm"
import { Pet } from "@pet/PetInterface"
import Loader from "@components/Loader"
//store
import { usePetActions } from "@store/store"

interface EditPetProps {
  navigation: any
  route: {params: { pet: Pet }}
}

const EditPetScreen: React.FC<EditPetProps> = ({ navigation, route }) => {
  const { pet } = route.params
  const { onUpdatePet } = usePetActions()

  const isFocused = useIsFocused()

  const initialValues: {
    name: string, age: number, species: string, breed: string, photo: string | null, petId: string 
  } = {
    name: pet.name, age: pet.age, species: pet.species, breed: pet.breed, photo: pet.photo ? pet.photo : null, petId: pet._id
  }

  const handleEditPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null)  => {
    await onUpdatePet!(name, age, species, breed, photoData, pet._id)
    navigation.navigate('Details', {pet: pet})
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (
    <View style={{flex: 1}}>
     { pet ?
      <PetForm onSubmit={handleEditPet} initialValues={initialValues} navigation={navigation} />
      : <Loader />
     }
    </View>
  )
}

export default EditPetScreen