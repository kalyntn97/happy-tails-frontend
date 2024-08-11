import { ViewStyle, ImageStyle } from "react-native"
import Colors from "./colors"
import { fullWH, centered, flexRow, flexColumn, basePadding } from "./spacing"
import { View } from "react-native-reanimated/lib/typescript/Animated"
import { TextStyle } from "react-native"

type accentColor = 'shadow' | 'pink' | 'yellow' | 'purple' | 'green' | 'blue' | 'red'

export const lightPalette = (accent: accentColor = 'pink') => ({
  text: Colors.black,
  button: Colors.black,
  focused: Colors[accent].darkest,
  unfocused: Colors.shadow.dark,
  border: Colors.shadow.dark,
  accent: Colors[accent].light,
  background: Colors.shadow.lightest,
  error: Colors.red.dark,
})

export const boxShadow: ViewStyle = {
  elevation: 3,
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
}

export const form: ViewStyle = {
  ...flexColumn,
  width: '100%',
}

export const inputBase: ViewStyle = {
  ...basePadding,
  marginVertical: 10,
}

export const input: ViewStyle = {
  ...inputBase,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: lightPalette().border,
}

export const card: ViewStyle = {
  ...centered,
  margin: 10,
  padding: 15,
  borderRadius: 15,
  backgroundColor: lightPalette().background,
}

export const cardWithShadow = {
  ...card,
  ...boxShadow,
}

export const basePhoto: ImageStyle = {
  borderRadius: 99,
  margin: 5,
}

export const med = {
  width: 150,
  height: 150,
}

export const small = {
  width: 120,
  height: 120,
}

export const xSmall = {
  width: 80,
  height: 80,
}

export const xxSmall = {
  width: 50,
  height: 50,
}

export const tiny = {
  width: 30,
  height: 30,
}

export const photo: ImageStyle = {
  ...med,
  ...basePhoto
}

export const smallPhoto: ImageStyle = {
  ...small,
  ...basePhoto
}

export const xSmallPhoto: ImageStyle = {
  ...xSmall,
  ...basePhoto
}

export const xxSmallPhoto: ImageStyle = {
  ...xxSmall,
  ...basePhoto
}

export const tinyPhoto: ImageStyle = {
  ...tiny,
  ...basePhoto
}

export const icon: ImageStyle = {
  width: 40,
  height: 40,
  margin: 5
}

export const smallIcon: ImageStyle = {
  ...tiny,
  margin: 2
}

export const xSmallIcon: ImageStyle = {
  width: 20,
  height: 20,
  margin: 2
}

export const tinyIcon: ImageStyle = {
  width: 15,
  height: 15,
  margin: 2
}

export const largeIcon: ImageStyle = {
  width: 60,
  height: 60,
  margin: 5
}

export const xLargeIcon: ImageStyle = {
  ...xSmall,
  margin: 5,
}

export const leftRounded = (rounded: number): ViewStyle => {
  return { borderTopLeftRadius: rounded, borderBottomLeftRadius: rounded }
}

export const rightRounded = (rounded: number): ViewStyle => {
  return { borderTopRightRadius: rounded, borderBottomRightRadius: rounded }
}

export const topRounded = (rounded: number): ViewStyle => {
  return { borderTopLeftRadius: rounded, borderTopRightRadius: rounded }
}

export const modalOverlay: ViewStyle = {
  ...fullWH,
  ...centered,
  position: 'relative',
  backgroundColor: Colors.transparent.semiLight,
}

export const bottomModal: ViewStyle = {
  ...flexColumn,
    width: '100%',
    marginTop: 'auto',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 10,
    backgroundColor: Colors.shadow.lightest,
    ...topRounded(15),
    ...boxShadow,
}

export const overlay: ViewStyle = {
  ...fullWH,
  alignItems: 'center',
}

export const rowCon: ViewStyle = {
  ...flexRow,
  width: '100%',
  justifyContent: 'space-evenly',
  marginVertical: 10,
}

export const roundedCon: ViewStyle = {
  width: '90%',
  backgroundColor: Colors.white,
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingTop: 10,
  paddingBottom: 20,
  marginVertical: 10,
}

export const roundedIconCon: ViewStyle = {
  ...centered,
  padding: 10,
  borderRadius: 99,
  backgroundColor: Colors.shadow.light,
  width: 100,
  height: 100,
}

export const successToast: ViewStyle = {
  backgroundColor: Colors.pink.lightest,
}

export const active: ViewStyle = {
  opacity: 1,
  elevation: 3
}

export const inactive: ViewStyle = {
  opacity: 0.3,
}

export const rowWithSeparator: ViewStyle = {
  width: '100%',
  paddingVertical: 20,
  borderBottomWidth: 1,
  borderColor: Colors.shadow.dark,
}

export const inputFocused: TextStyle = {
  borderColor: lightPalette().focused,
  color: lightPalette().focused,
}

export const inputUnfocused: TextStyle = {
  borderColor: lightPalette().unfocused,
  color: lightPalette().text,
}

export const inputError: TextStyle = {
  color: lightPalette().error,
  borderColor: lightPalette().error,
}

