import { ViewStyle } from "react-native"

export const basePadding = 10

export const baseMargin = 10

export const centered: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
}

export const flexRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
}

export const flexColumn: ViewStyle = {
  flexDirection: 'column',
  alignItems: 'center'
}

export const fullWH: ViewStyle = {
  width: '100%',
  height: '100%',
}

export const fullScreenDown: ViewStyle = {
  ...fullWH,
  ...flexColumn
}

export const fullScreenAcross: ViewStyle = {
  ...fullWH,
  ...flexRow
}

export const fullScreenCentered: ViewStyle = {
  ...fullWH,
  ...centered,
}