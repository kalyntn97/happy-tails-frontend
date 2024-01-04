
//npm modules
import { View } from "react-native"
//context
import { usePetContext } from "../context/PetContext"
//components
import PetForm from "../components/PetForm"

const NewPetScreen = ({ navigation }) => {
  const { onAddPet } = usePetContext()

  const handleAddPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    const result = await onAddPet!(name, age, species, breed, photoData)
    console.log('result', result)

    if (result && result.error) {
      alert(result.msg)
    }
    navigation.navigate('Index')
  }

  return ( 
    <View style={{flex: 1}}>
      <PetForm onSubmit={handleAddPet}/>   
    </View>
  )
}

export default NewPetScreen