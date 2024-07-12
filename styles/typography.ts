import { TextStyle } from "react-native"
import Colors from "./colors"

const base = {
  color: Colors.black,
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

export const xLarge: TextStyle = {
  fontSize: 40,
  lineHeight: 55,
}

export const large: TextStyle = {
  fontSize: 30,
  lineHeight: 30,
}

export const medium: TextStyle = {
  fontSize: 25,
  lineHeight: 35,
}

export const small: TextStyle = {
  fontSize: 20,
  lineHeight: 30,
}

export const xSmall: TextStyle = {
  fontSize: 15,
  lineHeight: 25,
}

export const xxSmall: TextStyle = {
  fontSize: 12,
  lineHeight: 18,
}

export const mainHeader = {
  ...header,
  ...xLarge,
}

export const subHeader = {
  ...header,
  ...large,
}

export const mediumHeader = {
  ...header,
  ...medium
}

export const smallHeader ={
  ...header,
  ...small,
}

export const xSmallHeader = {
  ...header,
  ...xSmall,
}

export const smallSubHeader: TextStyle = {
  ...small,
  ...sub,
}

export const xSmallSubHeader: TextStyle = {
  ...xSmall,
  ...sub,
}

export const body: TextStyle = {
  marginVertical: 5,
  color: Colors.black,
}

export const subBody: TextStyle = {
  fontStyle: 'italic',
  color: Colors.shadow.darkest,
}

export const regBody = {
  ...body,
  ...small,
}

export const smallBody = {
  ...xSmall,
  ...body,
}

export const smallSubBody: TextStyle = {
  ...xSmall,
  ...body,
  ...subBody,
}

export const xSmallBody = {
  ...xxSmall,
  ...body,
}

export const xSmallSubBody: TextStyle = {
  ...xxSmall,
  ...body,
  ...subBody,
}

export const focused: TextStyle = {
  fontWeight: 'bold',
  color: Colors.shadow.darkest,
}

export const unFocused: TextStyle = {
  fontWeight: 'normal',
  color: Colors.shadow.reg,
}

export const errorMsg: TextStyle = {
  ...focused,
  color: Colors.red.dark,
  fontSize: 15,
  margin: 5,
}