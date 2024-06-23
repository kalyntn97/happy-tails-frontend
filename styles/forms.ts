import { ViewStyle, ImageStyle } from "react-native"
import Colors from "./colors"
import { fullWH, centered, flexRow, flexColumn } from "./spacing"

export const boxShadow: ViewStyle = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
}

export const form: ViewStyle = {
  ...flexColumn,
  width: '100%',
}

export const inputBase: ViewStyle = {
  height: 50,
  paddingHorizontal: 10,
  paddingVertical: 10,
  marginVertical: 10,
  borderRadius: 8,
  borderWidth: 1,
  backgroundColor: '#FBFFFE',
  borderColor: Colors.pink.reg,
}

export const input: ViewStyle = {
  ...inputBase,
  width: 300,
}

export const card: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
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

export const modal: ViewStyle = {
  ...fullWH,
  ...centered,
  position: 'relative',
  backgroundColor: Colors.transparent.semiLight,
}

export const rowCon: ViewStyle = {
  width: '100%',
  ...flexRow,
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

export const leftRounded: ViewStyle = {
  borderTopLeftRadius: 8,
  borderBottomLeftRadius: 8,
}

export const rightRounded: ViewStyle = {
  borderTopRightRadius: 8,
  borderBottomRightRadius: 8,
}

export const leftMoreRounded: ViewStyle = {
  borderTopLeftRadius: 15,
  borderBottomLeftRadius: 15,
}

export const rightMoreRounded: ViewStyle = {
  borderTopRightRadius: 15,
  borderBottomRightRadius: 15,
}

export const topRounded: ViewStyle = {
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
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