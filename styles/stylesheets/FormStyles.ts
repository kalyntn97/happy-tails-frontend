import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Spacing.scrollContent,
  },
  containerWithPadding: {
    ...Spacing.scrollScreenDown,
    paddingTop: 50,
  },
  labelCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  label: {
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
  },
  titleCon: {
    ...Spacing.flexRow,
    width: '100%',
    zIndex: 1,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 15, 
    textAlign: 'left',
    maxWidth: '80%',
    minWidth: '60%',
  },
  leftInput: {
    width: 140,
  },
  rightInput: {
    width: 155,
  },
  btnCon: {
    ...Spacing.flexRow,
  },
  catAnimation: {
    width: '60%',
    aspectRatio: 1,
  }
})