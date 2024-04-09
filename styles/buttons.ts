import { ViewStyle, TextStyle } from "react-native"
import Colors from "./colors"
import { boxShadow } from "./forms"

//base
export const base: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10
}

export const roundedBase = {
  marginHorizontal: 10,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 99,
  backgroundColor: Colors.pink.reg
}

export const solid: ViewStyle = {
  ...base,
  ...boxShadow,
  backgroundColor: Colors.pink.reg,
}

export const transparent: ViewStyle = {
  ...base,
  borderWidth: 2,
}

export const sub: ViewStyle = {
  borderBottomWidth: 2
}
//text
export const buttonText: TextStyle = {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
}

export const whiteBtnText: TextStyle = {
  ...buttonText,
  color: Colors.white,
}
//sizes: ViewStyle
export const xSmall = {width: 100, height: 40 }

export const xxSmall = {width: 80, height: 30 }

export const small = {width: 120, height: 50 }

export const long = {width: 250, height: 50 }

export const rounded: ViewStyle = { borderRadius: 30 }

export const lessRounded: ViewStyle= { borderRadius: 15 }

export const square: ViewStyle = { borderRadius: 8 }
//buttons
export const smallRoundedSolid: ViewStyle = { ...small, ...solid, ...lessRounded }
export const longSquareSolid: ViewStyle = { ...long, ...solid, ...square }

export const smallRoundedTransparent: ViewStyle = { ...small, ...rounded, ...transparent }
export const xSmallRoundedTransparent: ViewStyle = { ...xSmall, ...rounded, ...transparent }
export const longRoundedTransparent: ViewStyle = { ...long, ...transparent, ...rounded }
export const xxSmallRoundedSolid: ViewStyle = { ...xxSmall, ...solid, ...rounded }

export const smallSubButton: ViewStyle = { ...sub, ...base }

export const xSmallSquareButton: ViewStyle = { ...xSmall, ...square, ...solid }
export const xSmallRoundButton: ViewStyle = { ...xSmall, ...rounded, ...solid }

export const roundButton = { ...solid, ...roundedBase, width: 60, height: 60 }

export const smallRoundButton = { ...solid, ...roundedBase, width: 20, height: 20 }