import { ViewStyle, ImageStyle } from "react-native"
import Colors from "./colors"
import { fullWH, centered } from "./spacing"

export const boxShadow: ViewStyle = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
}

export const form: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center'
}

export const inputBase: ViewStyle = {
  height: 50,
  paddingHorizontal: 10,
  paddingVertical: 10,
  margin: 10,
  borderRadius: 8,
  borderWidth: 1,
  backgroundColor: '#FBFFFE',
  borderColor: Colors.pink,
}

export const input: ViewStyle = {
  ...inputBase,
  width: 250,
}

export const card: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
  ...boxShadow
}

export const basePhoto: ImageStyle = {
  borderRadius: 99,
  margin: 5,
}

const med = {
  width: 150,
  height: 150,
}

const small = {
  width: 120,
  height: 120,
}

const xSmall = {
  width: 80,
  height: 80,
}

const xxSmall = {
  width: 50,
  height: 50,
}

const tiny = {
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

export const largeIcon: ImageStyle = {
  width: 60,
  height: 60,
  margin: 5
}

export const modal: ViewStyle = {
  ...fullWH,
  ...centered,
  position: 'relative',
  backgroundColor: Colors.transparent,
}