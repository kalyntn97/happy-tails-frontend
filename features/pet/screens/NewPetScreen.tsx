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
import { PetFormData,  PhotoFormData } from "@pet/PetInterface"
//styles
import { Spacing } from "@styles/index"

const NewPetScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  
  const addPetMutation = useAddPet(navigation)

  const handleAddPet = async (formData: PetFormData, photoData: PhotoFormData) => {
    addPetMutation.mutate({ formData, photoData })
  }

  useEffect(() => {
    if (!isFocused) navigation.goBack()
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