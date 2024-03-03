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

  const handleSubmit = (name: string, frequency: string, times: number, pets: string[]) => {
    addCareMutation.mutate({ name, frequency, times, pets }, {
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