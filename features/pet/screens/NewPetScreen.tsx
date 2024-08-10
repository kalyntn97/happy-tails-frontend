//npm modules
import { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//queries & store
import { useAddPet } from "../petQueries"
//components
import PetForm from "../components/PetForm"
//utils
import { PetFormData,  PhotoFormData } from "@pet/PetInterface"
//styles
import { Colors, Spacing } from "@styles/index"

const NewPetScreen = ({ navigation }) => {
  const [color, setColor] = useState<number>(0)
  const isFocused = useIsFocused()
  
  const addPetMutation = useAddPet(navigation)

  const handleAddPet = async (formData: PetFormData, photoData: PhotoFormData) => {
    addPetMutation.mutate({ formData, photoData })
  }

  useEffect(() => {
    if (!isFocused) navigation.goBack()
  }, [navigation, isFocused])

  return ( 
    <View style={[Spacing.fullScreenDown, { backgroundColor: Colors.multi.lightest[color] }]}>
      <PetForm onSubmit={handleAddPet} navigation={navigation} formStatus={addPetMutation.status} setColor={setColor} />
    </View>
  )
}

export default NewPetScreen