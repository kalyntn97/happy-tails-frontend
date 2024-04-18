import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Forms.form,
  },
  header: {
    ...Typography.mainHeader,
    color: Colors.pink.dark
  },
  input: {
    ...Forms.input,
  },
  rowCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    marginTop: 10,
    width: 250,
  },
  rowText: {
    fontSize: 15
  },
  bottomCon: {
    ...Spacing.flexColumn,
    marginTop: 'auto',
  },
  labelCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: 250,
    marginTop: 25,
    paddingHorizontal: 5,
  },
  label: {
    textAlign: 'left',
    width: 250,
    paddingHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
  },
  long: {
    width: 300
  }
})