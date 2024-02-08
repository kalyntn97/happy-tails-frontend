//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
//services
import { useCareContext } from "../context/CareContext"
import { Care } from "../services/careService"
import { Pet } from "../services/petService"
import * as careService from '../services/careService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

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
      <CareForm onSubmit={handleSubmit} initialValues={initialValues} />
      <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  },
  subBtn: {
    ...Buttons.smallSub,
  },
})

export default EditCareScreen