import { ViewStyle, ImageStyle } from "react-native"

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

export const input: ViewStyle = {
  width: 250,
  height: 50,
  paddingHorizontal: 10,
  paddingVertical: 10,
  margin: 10,
  borderRadius: 8,
  borderWidth: 1,
  backgroundColor: '#FBFFFE'
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

export const photo: ImageStyle = {
  width: 150,
  height: 150,
  ...basePhoto
}

export const smallPhoto: ImageStyle = {
  width: 120,
  height: 120,
  ...basePhoto
}

export const xSmallPhoto: ImageStyle = {
  width: 80,
  height: 80,
  ...basePhoto
}

export const xxSmallPhoto: ImageStyle = {
  width: 50,
  height: 50,
  ...basePhoto
}

export const tinyPhoto: ImageStyle = {
  width: 30,
  height: 30,
  ...basePhoto
}

export const icon: ImageStyle = {
  width: 40,
  height: 40,
  margin: 5
}

export const smallIcon: ImageStyle = {
  width: 30,
  height: 30,
  margin: 2
}

export const largeIcon: ImageStyle = {
  width: 60,
  height: 60,
  margin: 5
}