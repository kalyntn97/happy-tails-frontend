export const basePadding = 10

export const baseMargin = 10

export const centered = {
  justifyContent: 'center',
  alignItems: 'center',
}

export const flexRow = {
  flexDirection: 'row',
  justifyContent: 'center'
}

export const flexColumn = {
  flexDirection: 'column',
  alignItems: 'center'
}

export const fullWH = {
  width: '100%',
  height: '100%'
}

export const fullScreenDown = {
  ...fullWH,
  ...flexColumn
}

export const fullScreenAcross = {
  ...fullWH,
  ...flexRow
}
