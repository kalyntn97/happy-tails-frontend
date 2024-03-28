import { StyleSheet } from 'react-native'
import { Spacing, Forms } from '@styles/index'

export const styles = StyleSheet.create({
  task: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    marginVertical: 5,
    ...Spacing.flexRow,
    justifyContent: 'space-between'
  },
  taskContent: {
    ...Spacing.flexRow,
    justifyContent: 'space-around',
    flex: 14,
    paddingHorizontal: 10,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 4
  },
  taskStatus: {
    flex: 2,
    fontSize: 12,
  },
  taskPetList: {
    flex: 3
  },
  bulletBtn: {
    marginRight: 15,
    flex: 1,
  },
  bulletBtnText: {
    fontSize: 25,
    fontWeight: '100'
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  squareBtnContainer: {
    ...Spacing.flexRow,
    height: 70,
    marginLeft: 10
  },
  check: {
    width: 25,
    height: 25,
  }
})