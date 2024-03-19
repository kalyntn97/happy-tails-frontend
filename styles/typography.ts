import { TextStyle } from "react-native"

export const header: TextStyle = {
  margin: 20,
  fontWeight: 'bold',
  letterSpacing: 1,
  textAlign: 'center'
}

export const large: TextStyle = {
  fontSize: 40,
  lineHeight: 55,
}

export const medium: TextStyle = {
  fontSize: 25,
  lineHeight: 40,
}

export const small: TextStyle = {
  fontSize: 20,
  lineHeight: 30,
}

export const xSmall: TextStyle = {
  fontSize: 15,
  lineHeight: 25,
}

export const mainHeader = {
  ...header,
  ...large,
}

export const subHeader = {
  ...header,
  ...medium,
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
  margin: 10,
  textAlign: 'center',
  ...xSmall,
  fontStyle: 'italic',
}

export const body: TextStyle = {
  padding: 10,
}

export const smallBody = {
  ...xSmall,
  ...body,
}
