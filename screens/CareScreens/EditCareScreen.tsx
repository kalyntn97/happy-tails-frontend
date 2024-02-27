//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
//components
import CareForm from "@components/CareComponents/CareForm"
//services
import { useCareContext } from "@context/CareContext"
import { Care } from "@customTypes/CareInterface"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { SubButton } from "@components/ButtonComponent"

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const { care } = route.params
  const { onEditCare } = useCareContext()
  const isFocused = useIsFocused()
  const petData = care.pets.map(pet => pet._id)

  const initialValues: {
    name: string, frequency: string, times: number, pets: string[], careId: string
  } = {
    name: care.name, frequency: care.frequency, times: care.times, pets: petData, careId: care._id
  }

  const handleSubmit = async (name: string, frequency: string, times: number, pets: string[], careId: string) => {
    const updatedCareCard = await onEditCare!(name, frequency, times, pets, careId)
  
    navigation.navigate('Details', { careId: updatedCareCard._id })
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (  
    <View style={styles.container}>
      <CareForm onSubmit={handleSubmit} initialValues={initialValues} navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  }
})

export default EditCareScreen