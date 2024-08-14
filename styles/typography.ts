import { TextStyle } from "react-native"
import Colors from "./colors"
import { lightPalette } from "./ui"

const base = {
  color: lightPalette().text,
}

export const textSizeMap = {
  xLarge: { fontSize: 40, lineHeight: 50 },
  large: { fontSize: 30, lineHeight: 40 },
  med: { fontSize: 20, lineHeight: 30 },
  small: { fontSize: 15, lineHeight: 20 },
  xSmall: { fontSize: 12, lineHeight: 18 },
}

export const header: TextStyle = {
  ...base,
  margin: 20,
  fontWeight: 'bold',
  letterSpacing: 1,
  textAlign: 'center',
}

export const sub: TextStyle = {
  ...base,
  margin: 10,
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
  ...textSizeMap.xSmall,
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

export const errorMsg: TextStyle = {
  ...focused,
  color: Colors.red.dark,
  margin: 5,
}