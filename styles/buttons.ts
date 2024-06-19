import { ViewStyle, TextStyle } from "react-native"
import Colors from "./colors"
import { boxShadow } from "./forms"
import { centered } from "./spacing"

//base
export const base: ViewStyle = {
  ...centered,
  margin: 10,
  padding: 5
}

export const roundedBase = {
  marginHorizontal: 10,
  ...centered,
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
  borderWidth: 1.5,
}

export const sub: ViewStyle = {
  borderBottomWidth: 2
}
//text
export const baseButtonText: TextStyle = {
  fontWeight: 'bold',
}
export const smallText: TextStyle = {
  fontSize: 12,
  lineHeight: 15,
  letterSpacing: 0.15,
}
export const mediumText: TextStyle = {
  fontSize: 16,
  lineHeight: 21,
  letterSpacing: 0.25,
}

export const whiteText: TextStyle = { color: Colors.white }

export const buttonText = { ...baseButtonText, ...mediumText }

export const smallButtonText = { ...baseButtonText, ...smallText }

export const whiteButtonText = { ...smallButtonText, ...whiteText }
//sizes: ViewStyle
export const xSmall = {width: 100, height: 40 }

export const xxSmall = {width: 80, height: 30 }

export const small = {width: 120, height: 50 }

export const long = {width: 250, height: 50 }

export const rounded: ViewStyle = { borderRadius: 30 }

export const lessRounded: ViewStyle= { borderRadius: 15 }

export const square: ViewStyle = { borderRadius: 8 }
//buttons
export const smallRoundedSolid: ViewStyle = { ...small, ...solid, ...rounded }
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

export const mediumRoundButton = { ...solid, ...roundedBase, width: 40, height: 40 }

