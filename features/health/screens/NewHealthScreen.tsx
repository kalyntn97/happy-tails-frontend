//npm
import { useIsFocused } from "@react-navigation/native"
import { useEffect } from "react"
//components
import HealthForm from "@health/components/HealthForm"
import { ScrollScreen } from "@components/UIComponents"
import { AlertForm } from "@utils/ui"
//queries & types
import { Visit } from "@health/HealthInterface"
import { useAddHealth } from "@health/healthQueries"
//styles


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
    <ScrollScreen>
      <HealthForm navigation={navigation} onSubmit={handleSubmit} status={addHealthMutation.status} />
    </ScrollScreen>
  )
}

export default NewHealthScreen