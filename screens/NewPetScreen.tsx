
//npm modules
import { useEffect } from "react"
import { View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//context
import { usePetContext } from "../context/PetContext"
//components
import PetForm from "../components/PetForm"

const NewPetScreen = ({ navigation }) => {
  const { onAddPet } = usePetContext()

  const isFocused = useIsFocused()

  const handleAddPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    const result = await onAddPet!(name, age, species, breed, photoData)
    console.log('result', result)

    if (result && result.error) {
      alert(result.msg)
    }
    navigation.navigate('Index')
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return ( 
    <View style={{flex: 1}}>
      <PetForm onSubmit={handleAddPet}/>   
    </View>
  )
}

export default NewPetScreen