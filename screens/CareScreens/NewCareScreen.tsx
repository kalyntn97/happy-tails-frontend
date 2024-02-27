
//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
//components
import CareForm from "@components/CareComponents/CareForm"
//services
import { useCareContext } from "@context/CareContext"
//styles
import { Buttons, Spacing, Typography, Colors } from '@styles/index'
import { SubButton } from "@components/ButtonComponent"

const NewCareScreen: React.FC = ({ navigation }) => {
  const isFocused = useIsFocused()
  const { onAddCare } = useCareContext()

  const handleSubmit = async (name: string, frequency: string, times: number, pets: string[]) => {
    await onAddCare!(name, frequency, times, pets)
    navigation.navigate('Index')
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (
    <View style={styles.container}>
      <CareForm onSubmit={handleSubmit} navigation={navigation} />
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