import { StyleSheet } from "react-native"
//styles
import { Spacing, UI, Typography } from '@styles/index'
import { basePadding } from "@styles/spacing"

export const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumnStretch,
    ...basePadding(0, 0),
  },
  header: {
    ...Spacing.flexRowStretch,
  },
  title: {
    ...Typography.smallHeader,
    fontSize: 18,
    margin: 0,
    flex: 1,
    textAlign: 'left',
    marginLeft: 10,
  },
  rowCon: {
    ...Spacing.flexRow,
    width: '95%',
    justifyContent: 'space-between',
  },
  frequency: {
    ...Typography.subBody,
    width: '60%',
  },
  icon: {
    ...UI.icon('large'),
  },
})