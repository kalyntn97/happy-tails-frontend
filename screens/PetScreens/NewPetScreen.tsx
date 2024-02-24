//npm modules
import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//context
import { usePetContext } from "../../context/PetContext"
//components
import PetForm from "../../components/PetComponents/PetForm"
import { SubButton } from "../../components/ButtonComponent"
//styles
import { Spacing } from "../../styles"

const NewPetScreen = ({ navigation }) => {
  const { onAddPet } = usePetContext()

  const isFocused = useIsFocused()

  const handleAddPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    await onAddPet!(name, age, species, breed, photoData)
    navigation.navigate('Index')
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return ( 
    <View style={styles.container}>
      <PetForm onSubmit={handleAddPet} navigation={navigation} />
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