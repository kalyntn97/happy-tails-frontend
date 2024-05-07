//npm modules
import { useEffect } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//queries & store
import { useAddPet } from "../petQueries"
import { usePetActions } from "@store/store"
//components
import PetForm from "../components/PetForm"
//utils
import { AlertForm } from "@utils/ui"
//styles
import { Spacing } from "@styles/index"
import { InitialPet, PetMutationFormData, PhotoFormData } from "@pet/PetInterface"

const NewPetScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const { onAddPet } = usePetActions()
  const addPetMutation = useAddPet()

  const handleAddPet = async ({ name, species, breed, dob, firstMet, altered, status, color }: InitialPet, photoData: PhotoFormData) => {
    addPetMutation.mutate({ name, species, breed, dob, firstMet, altered, status, color, photoData }, {
      onSuccess: (data) => {
        onAddPet(data)
        navigation.navigate('Index')
        return AlertForm({ body: 'Pet added successfully', button: 'OK' })
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
    <View style={styles.container}>
      <PetForm onSubmit={handleAddPet} navigation={navigation} formStatus={addPetMutation.status} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered
  }
})

export default NewPetScreen