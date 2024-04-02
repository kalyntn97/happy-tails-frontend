import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    backgroundColor: Colors.white,
    ...Forms.cardWithShadow,
    width: '90%',
    height: 370,
    marginBottom: 40,
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    height: '50%',
    ...Spacing.flexColumn,
  },
  colorBox: {
    height: 70,
    width: '90%',
    marginTop: -40,
    borderRadius: 8,
    ...Forms.boxShadow,
  },
  titleContainer: {
    height: 70,
    width: '100%',
    ...Spacing.flexRow,
    justifyContent: 'space-around'
  },
  columnCon: {
    ...Spacing.flexColumn,
  },
  rowCon: {
    ...Spacing.flexRow,
  },
  title: {
    ...Typography.smallHeader,
    marginVertical: 0,
    color: Colors.darkPink
  },
  freq: {
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 20
  },
  subTitle: {
    ...Typography.xSmallHeader,
    // textDecorationLine: 'underline',
    marginBottom: 0
  },
  icon: {
    ...Forms.icon
  },
  body: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    marginTop: -35,
  },
  currentTracker: {
    width: '90%',
    height: 150,
  },
  btnText: {
    ...Buttons.buttonText,
  },
  mainBtn: {
    ...Buttons.smallSub,
    marginBottom: 40,
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 35,
    marginTop: 10,
  },
  bodyText: {
    ...Typography.smallBody,
    marginTop: 5,
    marginHorizontal: 2,
    marginBottom: 0,
  },
  mainBodyText: {
    ...Typography.regBody,
  }
})