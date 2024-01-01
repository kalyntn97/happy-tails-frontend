export const form = {
  alignItems: 'center',
  justifyContent: 'center'
}

export const input = {
  width: 250,
  height: 50,
  paddingHorizontal: 10,
  paddingVertical: 10,
  margin: 10,
  borderRadius: 8,
  borderWidth: 1,
  backgroundColor: 'white'
}

export const card = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 8,
  ...boxShadow
}

export const basePhoto = {
  borderRadius: 99,
  margin: 5,
}

export const photo = {
  width: 170,
  height: 170,
  ...basePhoto
}

export const smallPhoto = {
  width: 120,
  height: 120,
  ...basePhoto
}

export const boxShadow = {
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
}

export const icon = {
  
}