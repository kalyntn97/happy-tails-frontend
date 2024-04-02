import { FC } from "react"
import { StyleSheet, Text } from "react-native"

const EmptyList: FC  = () => (
  <Text style={styles.empty}>No tasks to manage.</Text>
)

const styles = StyleSheet.create({
  empty: {
    margin: 20,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
})

export default EmptyList