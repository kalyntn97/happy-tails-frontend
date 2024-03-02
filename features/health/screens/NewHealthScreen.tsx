//npm
import { View, Text, StyleSheet } from "react-native"
//components
import HealthForm from "@health/components/HealthForm"
import { SubButton } from "@components/ButtonComponent"
//styles
import { Spacing } from "@styles/index"


const NewHealthScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <HealthForm navigation={navigation} />
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