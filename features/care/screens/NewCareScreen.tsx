//npm
import { useEffect, useRef, useState } from "react"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
//components
import CareForm from "../components/CareForm"
import { useAddCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"
//styles
import { Buttons, Spacing, Typography, Colors } from '@styles/index'

const NewCareScreen = ({ navigation }) => {
  const [color, setColor] = useState<number>(0)

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
    <View style={{ flex: 1, backgroundColor: Colors.multi.lightest[color] }}>
      <CareForm onSubmit={handleSubmit} navigation={navigation} status={addCareMutation.status} setColor={setColor} />
    </View>  
  )
}

export default NewCareScreen