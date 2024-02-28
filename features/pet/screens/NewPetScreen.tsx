//npm modules
import { useEffect } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//queries
import { useAddPet } from "../petQueries"
//components
import PetForm from "../components/PetForm"
import { SubButton } from "@components/ButtonComponent"
//styles
import { Spacing } from "@styles/index"

const NewPetScreen = ({ navigation }) => {
  // const { onAddPet } = usePet()
  const isFocused = useIsFocused()
  const addPetMutation = useAddPet()
  const { mutate, isPending, isSuccess, isError } = addPetMutation
  const handleAddPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    mutate({ name, age, species, breed, photoData }, {
      onSuccess: () => navigation.navigate('Index')
    })
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return ( 
    <View style={styles.container}>
      <PetForm onSubmit={handleAddPet} navigation={navigation} isPending={isPending} />
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