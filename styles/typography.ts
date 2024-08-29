import { TextStyle } from "react-native"
import Colors from "./colors"
import { lightPalette } from "./ui"

const base = {
  color: lightPalette().text,
}

export const textSizeMap = {
  xLarge: { fontSize: 30, lineHeight: 35 },
  large: { fontSize: 25, lineHeight: 30 },
  med: { fontSize: 20, lineHeight: 25 },
  small: { fontSize: 15, lineHeight: 20 },
  xSmall: { fontSize: 12, lineHeight: 18 },
}

export const header: TextStyle = {
  ...base,
  marginVertical: 20,
  fontWeight: 'bold',
  letterSpacing: 1,
  textAlign: 'center',
}

export const sub: TextStyle = {
  ...base,
  marginVertical: 10,
  fontWeight: 'normal',
  textAlign: 'center',
  fontStyle: 'italic',
  letterSpacing: 0.5,
}

export const body: TextStyle = {
  ...base,
  marginVertical: 5,
}

export const subBody: TextStyle = {
  fontStyle: 'italic',
  color: Colors.shadow.darkest,
}

export const largeHeader = {
  ...header,
  ...textSizeMap.xLarge,
}

export const mainHeader = {
  ...header,
  ...textSizeMap.large,
}

export const subHeader = {
  ...header,
  ...textSizeMap.med,
}

export const smallHeader = {
  ...header,
  ...textSizeMap.small,
}

export const smallSubHeader: TextStyle = {
  ...sub,
  ...textSizeMap.small,
}

export const largeBody = {
  ...body,
  ...textSizeMap.med,
}

export const regBody = {
  ...body,
  ...textSizeMap.small,
}

export const smallBody = {
  ...body,
  ...textSizeMap.xSmall,
}

export const smallSubBody: TextStyle = {
  ...subBody,
  ...textSizeMap.xSmall,
}

export const focused: TextStyle = {
  fontWeight: 'bold',
  color: Colors.black,
}

export const unFocused: TextStyle = {
  fontWeight: 'normal',
  color: Colors.shadow.dark,
}

export const error: TextStyle = {
  fontWeight: 'bold',
  color: Colors.red.dark,
}