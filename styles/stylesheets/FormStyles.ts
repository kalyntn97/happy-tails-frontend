import { StyleSheet } from "react-native"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

export const styles = StyleSheet.create({
  container: {
    ...Spacing.scrollContent,
  },
  containerWithPadding: {
    ...Spacing.scrollScreenDown,
    paddingTop: 50,
  },
  header: {
    ...Typography.mediumHeader,
    marginTop: 30,
    color: Colors.pink.darkest
  },
  bottomCon: {
    ...Spacing.flexColumn,
    marginTop: 30,
  },
  labelCon: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  label: {
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
  },
  photoUpload: {
    ...UI.photo,
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