import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  topBtnCon: {
    ...Spacing.flexRow,
    marginLeft: 'auto', 
    paddingTop: 50,
    marginRight: 10,
    paddingBottom: 10,
    width: '20%', 
    justifyContent: 'space-between', 
  },
  headerContainer: {
    ...Spacing.flexColumnStretch,
    marginBottom: 20,
  },
  header: {
    ...Typography.subHeader,
    marginVertical: 10,
    color: Colors.shadow.darkest,
  },
  petCon: {
    marginBottom: 15,
    height: 100
  },
  itemInfo: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  itemIcon: {
    ...UI.icon(),
  },
  subHeader: {
    ...Typography.smallSubHeader,
    letterSpacing: 0,
  },
  rowCon: {
    ...Spacing.flexRow,
  },
  btnContainer: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  smallBtnCon: {
    ...Spacing.flexRow,
    width: '80%',
    // marginTop: 5,
    position: 'absolute',
    top: -40,
    left: 95,
    justifyContent: 'space-evenly',
  },
  btnText: {
    ...Buttons.buttonText
  },
  editIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -35,
    right: 5,
  },
  detailText: {
    ...Typography.smallBody,
    marginHorizontal: 5,
  },
  notesInput: {
    width: '100%',
    ...Typography.smallSubBody,
    margin: 5,
  },
  overlay: {
    ...UI.modalOverlay,
  },
  noteInputCon: {
    ...Spacing.flexColumnStretch,
    minHeight: 40,
    marginHorizontal: 5,
  },
  pastVisitCon: {
    ...Spacing.flexColumnStretch,
    marginTop: 10,
    marginBottom: -10,
  },
  showButton: {
    position: 'absolute',
    right: 30,
    top: 10,
  },
  doneCon: {
    ...Spacing.flexColumnStretch,
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
    ...Typography.smallSubHeader,
  },
  pastDue: {
    color: Colors.red.reg, 
    fontWeight: 'bold'
  }
})