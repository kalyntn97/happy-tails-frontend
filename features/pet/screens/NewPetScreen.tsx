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

const NewPetScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const { onAddPet } = usePetActions()
  const addPetMutation = useAddPet()

  const handleAddPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    addPetMutation.mutate({ name, age, species, breed, photoData }, {
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
      <PetForm onSubmit={handleAddPet} navigation={navigation} status={addPetMutation.status} />
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