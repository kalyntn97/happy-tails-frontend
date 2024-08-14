import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { lightPalette } from "@styles/ui"

export const styles = StyleSheet.create({
  container: {
    ...UI.form(10, 20),
  },
  containerWithPadding: {
    ...UI.form(10, 60, 50),
  },
  labelCon: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  label: {
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
  },
  headerCon: {
    ...Spacing.flexRowStretch,
    flexWrap: 'wrap',
    zIndex: 1,
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  titleCon: {
    ...Spacing.flexColumnStretch,
    marginLeft: 15, 
    alignItems: 'flex-start',
  },
  subtitleCon: {
    ...Spacing.flexRow,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 10,
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'left',
    maxWidth: '100%',
    minWidth: '60%',
  },
  subtitle: {
    ...Typography.smallSubHeader,
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
  },
  contentCon: {
    ...UI.roundedCon,
    ...Spacing.flexColumn, 
    alignItems: 'flex-start',
  },
  rowCon: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: lightPalette().border,
  }
})