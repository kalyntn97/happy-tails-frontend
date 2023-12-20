export const header = {
  margin: 20,
  fontWeight: 'bold',
  letterSpacing: 1,
}

export const large = {
  fontSize: 40,
  lineHeight: 55,
}

export const medium = {
  fontSize: 25,
  lineHeight: 40,
}

export const small = {
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

export const body = {
  padding: 10,
}

export const smallBody = {
  ...small,
  ...body,
}