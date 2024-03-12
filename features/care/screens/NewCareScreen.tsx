//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
//components
import CareForm from "../components/CareForm"
import { useAddCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"
//styles
import { Buttons, Spacing, Typography, Colors } from '@styles/index'

const NewCareScreen: React.FC = ({ navigation }) => {
  const isFocused = useIsFocused()
  const addCareMutation = useAddCare()

  const handleSubmit = (name: string, pets: string[], repeat: boolean, ending: boolean, date: Date, endDate: Date, frequency: string, times: number) => {
    addCareMutation.mutate({ name, pets, repeat, ending, date, endDate, frequency, times }, {
      onSuccess: () => {
        navigation.navigate('Index')
        return AlertForm({ body: `Added successfully`, button: 'OK' })
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
      <CareForm onSubmit={handleSubmit} navigation={navigation} status={addCareMutation.status} />
    </View>  
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered
  }
})

export default NewCareScreen