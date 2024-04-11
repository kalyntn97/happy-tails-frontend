import { Typography } from "@styles/index"
import { FC } from "react"
import { StyleSheet, Text } from "react-native"

const EmptyList: FC  = () => (
  <Text style={styles.empty}>No tasks to manage.</Text>
)

const styles = StyleSheet.create({
  empty: {
    ...Typography.smallSubHeader
  },
})

export default EmptyList