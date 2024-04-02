import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  scrollContent: {
    alignItems: 'center' 
  },
  headerContainer: {
    ...Spacing.flexColumn,
    width: '100%',
  },
  header: {
    ...Typography.subHeader,
    marginBottom: 0,
    color: Colors.darkPink,
  },
  petCon: {
    marginBottom: 15,
    height: 100
  },
  itemInfo: {
    ...Spacing.flexRow,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  itemIcon: {
    ...Forms.smallIcon,
  },
  subHeader: {
    ...Typography.xSmallSubHeader,
  },
  rowCon: {
    ...Spacing.flexRow,
  },
  btnContainer: {
    ...Spacing.flexRow,
    marginVertical: 10
  },
  smallBtnCon: {
    ...Spacing.flexRow,
    marginTop: 5,
    position: 'absolute',
    top: -35,
    left: 60,
    width: '90%',
    justifyContent: 'space-evenly',
  },
  mainBtn: {
    ...Buttons.xSmallSquare
  },
  subBtn: {
    ...Buttons.smallSub,
    marginLeft: 'auto',
  },
  btnText: {
    ...Buttons.buttonText
  },
  miniIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -30,
    right: 10,
  },
  detailText: {
    ...Typography.xSmallBody,
    marginHorizontal: 5,
  },
  notesInput: {
    width: '100%',
    ...Typography.smallSubBody,
    margin: 5,
  },
  overlay: {
    ...Forms.modal,
  },
  noteInputCon: {
    ...Spacing.flexColumn,
    width: '100%',
    minHeight: 40,
    marginHorizontal: 5,
  },
  pastVisitCon: {
    ...Spacing.flexColumn,
    width: '100%',
    marginTop: 10,
    marginBottom: -10,
  },
  showButton: {
    position: 'absolute',
    right: 30,
    top: 10,
  },
  doneCon: {
    ...Spacing.flexColumn,
    width: '100%',
    borderRadius: 15,
    padding: 10,
    marginVertical: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  notes: {
    width: '100%',
    marginVertical: 10,
  },
  emptyNote: {
    opacity: 0.5
  },
  visitStatus: {
    ...Typography.smallSubBody,
    fontSize: 10,
    marginHorizontal: 5,
    color: 'gray',
  },
  msg: {
    ...Typography.xSmallSubHeader,
  },
  pastDue: {
    color: Colors.red, 
    fontWeight: 'bold'
  }
})