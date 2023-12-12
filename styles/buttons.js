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

export const small = {
  width: 140,
  height: 50,
}

export const rounded = {
  borderRadius: 30
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

export const buttonText = {
  fontSize: 16,
  lineHeight: 21,
  fontWeight: 'bold',
  letterSpacing: 0.25,
}