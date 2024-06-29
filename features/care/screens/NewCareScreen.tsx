//npm
import { useEffect } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
//components
import CareForm from "../components/CareForm"
import { useAddCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"
//styles
import { Buttons, Spacing, Typography, Colors } from '@styles/index'
import { CareFormData } from "@care/CareInterface"

const NewCareScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const addCareMutation = useAddCare(navigation)

  const handleSubmit = (formData: CareFormData) => {
    addCareMutation.mutate(formData)
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (
    <View style={{ ...Spacing.fullScreenDown }}>
      <CareForm onSubmit={handleSubmit} navigation={navigation} status={addCareMutation.status} />
    </View>  
  )
}

export default NewCareScreen