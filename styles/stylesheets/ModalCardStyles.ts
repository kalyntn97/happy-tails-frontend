import { StyleSheet } from "react-native"
//styles
import { Spacing, UI, Typography } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...UI.cardWithShadow,
    width: '90%',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  header: {
    ...Spacing.flexRow,
    justifyContent: 'flex-start',
    width: '100%',
  },
  subHeader: {
    ...Spacing.flexRow,
    width: '100%',
    justifyContent: 'space-between',
    height: 80,
  },
  title: {
    ...Typography.smallHeader,
    marginVertical: 0,
    marginHorizontal: 10,
    width: '70%',
    textAlign: 'left',
  },
  freq: {
    ...Typography.smallSubBody,
    marginLeft: 5,
  },
  subTitle: {
    ...Typography.xSmallHeader,
    marginBottom: 0,
    marginTop: 10,
  },
  icon: {
    ...UI.icon()
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
  },
  desCon: {
    width: '100%',
    padding: 10,
    paddingLeft: '20%',
  },
  des: {
    ...Typography.xSmallSubHeader,
    marginTop: -15,
    marginBottom: 0,
    textAlign: 'left',
  }
})