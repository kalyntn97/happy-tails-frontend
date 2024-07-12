//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { View, Text, StyleSheet } from "react-native"
//components
import HealthForm from "@health/components/HealthForm"
import { SubButton } from "@components/ButtonComponent"
import { AlertForm } from "@utils/ui"
//queries & types
import { Visit } from "@health/HealthInterface"
import { useAddHealth } from "@health/healthQueries"
//styles
import { Spacing } from "@styles/index"


const NewHealthScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const addHealthMutation = useAddHealth()

  const handleSubmit = (pet: string, type: string, name: string, vaccine: string, times: number, frequency: string, lastDone: Visit[], nextDue: Date) => {
    addHealthMutation.mutate({ pet, type, name, vaccine, times, frequency, lastDone, nextDue }, {
      onSuccess: () => {
        navigation.navigate('Main')
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
      <HealthForm navigation={navigation} onSubmit={handleSubmit} status={addHealthMutation.status} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered
  }
})
 
export default NewHealthScreen