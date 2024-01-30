export const header = {
  margin: 20,
  fontWeight: 'bold',
  letterSpacing: 1,
  textAlign: 'center'
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
  fontSize: 20,
  lineHeight: 30,
}

export const xSmall = {
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

export const smallSubHeader = {
  margin: 10,
  textAlign: 'center',
  letterSpacing: 1,
  ...xSmall,
  fontStyle: 'italic',
}

export const body = {
  padding: 10,
}

export const smallBody = {
  ...xSmall,
  ...body,
}
