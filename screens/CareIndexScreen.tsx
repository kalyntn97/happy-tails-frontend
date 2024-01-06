//npm modules
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import CareCard from "../components/CareCard"


const CareIndexScreen = () => {



  return (
    <View style={styles.container}>
      <Text>All your pets' care here</Text>
      <View style={styles.card}>
        <CareCard />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
  },
  card: {
    width: '90%',
    height: '50%',
  }
})
 
export default CareIndexScreen