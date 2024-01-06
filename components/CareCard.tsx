import { View, StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
//types
import { Pet } from "../services/petService"

interface Tracker {
  _id: string
  name: string
  total: number
  done: number
  skipped: number
  left: number
}

interface CareCard {
  _id: string
  pets: Pet[]
  name: string
  times: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  trackers: Array<string>
}

const CareCard = () => {
  return (
    <View style={styles.container}>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
  },
})
 
export default CareCard