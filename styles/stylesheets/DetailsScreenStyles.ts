import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  headerCon: {
    ...Spacing.flexColumnStretch,
    marginBottom: 20,
  },
  headerTopCon: {
    ...Spacing.flexRowStretch,
  },
  header: {
    ...Typography.subHeader,
    flex: 1,
    textAlign: 'left',
  },
  headerIcon: {
    ...UI.icon('large'),
    marginRight: 15,
  },
  rowCon: {
    ...Spacing.flexRowStretch,
    alignSelf: 'flex-start',
  },
  subHeader: {
    ...Typography.smallSubHeader,
    letterSpacing: 0,
    marginLeft: 5,
  },
  sectionCon: {
    ...UI.card(),
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