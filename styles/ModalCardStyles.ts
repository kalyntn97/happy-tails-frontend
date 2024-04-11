import { StyleSheet } from "react-native"
//styles
import { Spacing, Forms, Typography } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Forms.cardWithShadow,
    width: '90%',
    height: 370,
    justifyContent: 'flex-start'
  },
  header: {
    ...Spacing.flexRow,
    margin: 0,
    padding: 0,
    justifyContent: 'flex-start',
    width: '100%',
  },
  subHeader: {
    ...Spacing.flexRow,
    width: '100%',
    height: 80,
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.smallHeader,
    marginVertical: 0,
  },
  freq: {
    ...Typography.xSmallSubHeader,
  },
  subTitle: {
    ...Typography.xSmallHeader,
    // textDecorationLine: 'underline',
    marginBottom: 0,
    marginTop: 10,
  },
  icon: {
    ...Forms.icon
  },
  body: {
    width: '100%',
    alignItems: 'center',
  },
  currentTracker: {
    width: '90%',
    height: 150,
  },
  bodyText: {
    ...Typography.smallBody,
    fontWeight: 'normal'
  },
  dateCon: { 
    marginTop: 'auto', 
    alignItems: 'flex-start', 
    width: '100%' 
  }
})