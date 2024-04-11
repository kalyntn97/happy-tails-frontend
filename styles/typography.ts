import { TextStyle } from "react-native"
import Colors from "./colors"

const base = {
  // color: Colors.shadow.darkest,
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
  textAlign: 'center',
  fontStyle: 'italic',
  // fontWeight: 'bold',
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

}

export const regBody = {
  ...body,
  ...small,
}

export const smallBody = {
  ...xSmall,
  ...body,
}

export const xSmallBody = {
  ...xxSmall,
  ...body,
}

export const smallSubBody: TextStyle = {
  ...xxSmall,
  ...body,
  fontStyle: 'italic',
}

export const focused: TextStyle = {
  fontWeight: 'bold',
  color: Colors.shadow.darkest,
}

export const unFocused: TextStyle = {
  color: Colors.shadow.reg,
}

