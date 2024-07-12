import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  taskTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 4
  },
  taskStatus: {
    flex: 1.7,
    fontSize: 12,
  },
  taskPetList: {
    flex: 3,
  },
  done: {
    textDecorationLine: 'line-through',
  }
})