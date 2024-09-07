import { StyleSheet } from "react-native"
//styles
import { Spacing, Typography, UI } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumnStretch,
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
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 15,
    zIndex: 1,
  },
  titleCon: {
    ...Spacing.flexColumnStretch,
    marginLeft: 15, 
    alignItems: 'flex-start',
    flex: 1,
  },
  title: {
    ...Typography.subHeader,
    textAlign: 'left',
    margin: 0,
    maxWidth: '100%',
  },
  subtitleCon: {
    ...Spacing.flexRow,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 10,
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
    ...UI.card(),
    width: '100%',
    alignItems: 'flex-start',
  },
  rowCon: {
    ...UI.tableRow(),
    ...UI.rowContent('space-between', 0, 15, 0),
  },
})