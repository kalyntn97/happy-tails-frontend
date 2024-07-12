//npm
import { FC, useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { View, Text, StyleSheet } from "react-native"
//components
import HealthForm from "@health/components/HealthForm"
import { SubButton } from "@components/ButtonComponent"
import { AlertForm } from "@utils/ui"
//queries & types
import { Pet } from "@pet/PetInterface"
import { Health, Visit } from "@health/HealthInterface"
import { useUpdateHealth } from "@health/healthQueries"
//styles
import { Spacing } from "@styles/index"

interface EditHealthProps {
  navigation: any
  route?: { params?: { health?: Health }}
}

const EditHealthScreen: FC<EditHealthProps> = ({ navigation, route }) => {
  const { health } = route.params
  const isFocused = useIsFocused()

  const updateHealthMutation = useUpdateHealth()

  const initialValues: { pet: Pet, type: string, name: string, vaccine: string | null, times: number, frequency: string, lastDone: Visit[], nextDue: Visit | null, healthId: string } = {
    pet: health.pet, type: health.type, name: health.name, vaccine: health.vaccine, times: health.times, frequency: health.frequency, lastDone: health.lastDone, nextDue: health.nextDue, healthId: health._id
  }

  const handleSubmit = async (pet: string, type: string, name: string, vaccine: string, times: number, frequency: string, lastDone: Visit[], nextDue: Visit, healthId: string) => {
    updateHealthMutation.mutate({ pet, type, name, vaccine, times, frequency, lastDone, nextDue, healthId }, {
      onSuccess: () => {
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
      <HealthForm navigation={navigation} onSubmit={handleSubmit} status={updateHealthMutation.status} initialValues={initialValues}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered
  }
})
 
export default EditHealthScreen