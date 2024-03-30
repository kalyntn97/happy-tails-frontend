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
    top: -40,
    left: 80,
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
  },
  detailText: {
    ...Typography.smallBody,
    marginHorizontal: 5,
  },
  notesInput: {
    width: '100%',
    fontStyle: 'italic',
    marginVertical: 15,
  },
  overlay: {
    ...Forms.modal,
  },
  noteInputCon: {
    ...Spacing.flexColumn,
    width: '100%',
    minHeight: 40,
  },
  pastVisitCon: {
    ...Spacing.flexColumn,
    width: '90%',
    marginVertical: 20,
  },
  doneCon: {
    ...Spacing.flexColumn,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 5,
    alignItems: 'flex-start'
  },
  notes: {
    width: '100%',
    marginVertical: 10,
  },
  emptyCon: {

  },
  msg: {
    ...Typography.xSmallHeader,
  },
})