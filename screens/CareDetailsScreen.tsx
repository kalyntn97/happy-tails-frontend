//npm
import { StyleSheet, Text, View } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CareDetailsProps {
  navigation: any
  route: { params: { careId: string }}
}

const CareDetailsScreen = ({ navigation, route }) => {
  

  return (  
    <View style={styles.container}>
      <Text>Care details</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
})

export default CareDetailsScreen