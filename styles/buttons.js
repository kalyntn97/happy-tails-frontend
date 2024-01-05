export const base = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10
}

export const main = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  backgroundColor: 'grey',
}

export const sub = {
  borderBottomWidth: 2
}

export const xSmall = {
  width: 100,
  height: 40,
}

export const small = {
  width: 140,
  height: 50,
}

export const long = {
  width: 250,
  height: 50
}

export const rounded = {
  borderRadius: 30
}

export const lessRounded = {
  borderRadius: 15
}

export const square = {
  borderRadius: 8
}

export const smallRounded = {
  ...base,
  ...main,
  ...small,
  ...rounded,
}

export const smallSub = {
  ...base,
  ...sub,
}

export const xSmallRounded = {
  ...base,
  ...main,
  ...xSmall,
  ...rounded,
}

export const xSmallSquare = {
  ...base,
  ...main,
  ...xSmall,
  ...square,
}

export const longSquare = {
  ...base,
  ...main,
  ...long,
  ...square
}

export const buttonText = {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
}

