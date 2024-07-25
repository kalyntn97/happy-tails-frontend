import { ViewStyle, TextStyle } from "react-native"
import Colors from "./colors"
import { boxShadow, lightPalette } from "./ui"
import { centered } from "./spacing"

//corners
export const rounded: ViewStyle = { borderRadius: 30 }
export const lessRounded: ViewStyle= { borderRadius: 15 }
export const square: ViewStyle = { borderRadius: 8 }
//base
export const base: ViewStyle = {
  ...centered,
  margin: 10,
  cursor: 'pointer',
}

export const main: ViewStyle = {
  ...base,
  paddingHorizontal: 20,
  paddingVertical: 10,
}

export const sub: ViewStyle = {
  ...base,
  borderBottomWidth: 2,
  paddingBottom: 0,
  paddingHorizontal: 0,
}

export const circle = {
  ...centered,
  borderRadius: 99,
}

export const circleBase = {
  ...circle,
  ...boxShadow,
  marginHorizontal: 10,
}

export const squareBase = {   
  ...centered,
  ...square,
  borderWidth: 1,
  borderColor: lightPalette.border,
}

export const solid: ViewStyle = {
  ...main,
  ...boxShadow,
}

export const transparent: ViewStyle = {
  ...main,
  borderWidth: 1.5,
}
//text
export const baseButtonText: TextStyle = {
  fontWeight: 'bold',
  textTransform: 'capitalize',
}
export const smallText: TextStyle = {
  fontSize: 12,
  letterSpacing: 0.15,
}
export const mediumText: TextStyle = {
  fontSize: 16,
  letterSpacing: 0.25,
}

export const whiteText: TextStyle = { color: Colors.white }

export const buttonText = { ...baseButtonText, ...mediumText }

export const smallButtonText = { ...baseButtonText, ...smallText }

export const whiteButtonText = { ...baseButtonText, ...whiteText }
//sizes: ViewStyle
export const xSmall = { minWidth: 100, height: 40 }

export const xxSmall = { minWidth: 80, height: 35 }

export const small = { minWidth: 120, height: 50 }

export const long = { minWidth: 250, height: 50 }
//buttons
export const smallRoundedSolid: ViewStyle = { ...small, ...solid, ...rounded }
export const longSquareSolid: ViewStyle = { ...long, ...solid, ...square }

export const smallRoundedTransparent: ViewStyle = { ...small, ...rounded, ...transparent }
export const xSmallRoundedTransparent: ViewStyle = { ...xSmall, ...rounded, ...transparent }
export const longRoundedTransparent: ViewStyle = { ...long, ...transparent, ...rounded }
export const xxSmallRoundedSolid: ViewStyle = { ...xxSmall, ...solid, ...rounded }

export const subButton: ViewStyle = { ...sub }

export const xSmallSquareButton: ViewStyle = { ...xSmall, ...square, ...solid }
export const xSmallRoundButton: ViewStyle = { ...xSmall, ...rounded, ...solid }
export const largeSquareButton: ViewStyle = { ...squareBase, paddingHorizontal: 15, paddingVertical: 10 }

export const roundButton = { ...circleBase, width: 60, height: 60 }

export const smallRoundButton = { ...circleBase, width: 20, height: 20 }

export const mediumRoundButton = { ...circleBase, width: 40, height: 40 }

