import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Forms.form,
    paddingBottom: 20,
  },
  header: {
    ...Typography.mainHeader,
    color: Colors.pink.dark
  },
  input: {
    ...Forms.input,
  },
  rowCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: 300,
  },
  rowText: {
    fontSize: 15
  },
  bottomCon: {
    ...Spacing.flexColumn,
    marginTop: 'auto',
  },
  labelCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: 300,
    marginTop: 25,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  label: {
    textAlign: 'left',
    width: 300,
    paddingHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
  },
  photoUpload: {
    ...Forms.photo,
    position: 'relative',
    overflow: 'hidden',
    margin: 20,
    backgroundColor: Colors.pink.light,
    elevation: 2,
  },
  image: {
    ...Spacing.fullWH,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.pink.reg,
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    ...Spacing.centered
  },
  cameraIcon: {
    width: 20,
    height: 20,
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
  }
})