import { ViewStyle, TextStyle } from "react-native"
import Colors from "./colors"

export const base: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10
}

export const main: ViewStyle = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  backgroundColor: 'grey',
}

export const sub: ViewStyle = {
  borderBottomWidth: 2
}

export const xSmall = {
  width: 100,
  height: 40,
}

export const xxSmall = {
  width: 80,
  height: 30,
}

export const small = {
  width: 140,
  height: 50,
}

export const long = {
  width: 250,
  height: 50
}

export const rounded: ViewStyle = {
  borderRadius: 30
}

export const lessRounded: ViewStyle= {
  borderRadius: 15
}

export const square: ViewStyle = {
  borderRadius: 8
}

export const smallRounded = {
  ...base,
  ...main,
  ...small,
  ...rounded,
}

export const smallSquare = {
  ...base,
  ...main,
  ...small,
  ...square,
}

export const smallSub = {
  ...base,
  ...sub,
}

export const xSmallRounded = {
  ...base,
  ...main,
  ...xSmall,
  ...rounded,
}

export const xSmallSquare = {
  ...base,
  ...main,
  ...xSmall,
  ...square,
}

export const longSquare = {
  ...base,
  ...main,
  ...long,
  ...square
}

export const longRounded = {
  ...base,
  ...main,
  ...long,
  ...rounded,
}

export const xxSmallRounded = {
  ...base,
  ...main,
  ...xxSmall,
  ...rounded
}

export const buttonText: TextStyle = {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
}

export const roundButton = {
  width: 60,
  height: 60,
  borderRadius: '50%'
}