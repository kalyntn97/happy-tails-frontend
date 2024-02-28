
//npm
import { useEffect } from "react"
import { useIsFocused } from "@react-navigation/native"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
//components
import CareForm from "../components/CareForm"
import { useCareActions } from "@store/store"
//styles
import { Buttons, Spacing, Typography, Colors } from '@styles/index'

const NewCareScreen: React.FC = ({ navigation }) => {
  const isFocused = useIsFocused()
  const { onAddCare } = useCareActions()

  const handleSubmit = async (name: string, frequency: string, times: number, pets: string[]) => {
    await onAddCare!({ name, frequency, times, pets })
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