//npm
import { View, Text, StyleSheet } from "react-native"
//components
import VetForm from "@components/HealthComponents/HealthForm"
import { SubButton } from "@components/ButtonComponent"
//styles
import { Spacing } from "@styles/index"


const NewHealthScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <VetForm navigation={navigation} />
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