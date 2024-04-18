//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
import Loader from "@components/Loader"
//types
import { Care } from "@care/CareInterface"
import { Pet } from "@pet/PetInterface"
//store
import { useUpdateCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const { care } = route.params
  const isFocused = useIsFocused()
 
  const updateCareMutation = useUpdateCare()

  const initialValues: {
    name: string, pets: Pet[], repeat: boolean, ending: boolean, date: string, endDate: string | null, frequency: string | null, times: number | null, color: number, careId: string
  } = {
    name: care.name, pets: care.pets, repeat: care.repeat, ending: care.ending, date: care.date, endDate: care.endDate, frequency: care.frequency, times: care.times, color: care.color, careId: care._id
  }

  const handleSubmit = async (name: string, pets: string[], repeat: boolean, ending: boolean, date: Date, endDate: Date | null, frequency: string | null, times: number | null, color: number, careId: string) => {
   updateCareMutation.mutate({ name, pets, repeat, ending, date, endDate, frequency, times, color, careId }, {
      onSuccess: (data) => {
        navigation.navigate('Main')
        return AlertForm({ body: `Updated successfully`, button: 'OK' })
      },
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      },
    })
  
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (  
    <View style={styles.container}>
      {care ? 
        <CareForm onSubmit={handleSubmit} initialValues={initialValues} navigation={navigation} status={updateCareMutation.status} />
        : <Loader />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  }
})

export default EditCareScreen