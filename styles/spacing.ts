import { ViewStyle } from "react-native"

export const basePadding = (h: number = 20, v: number = 15, b?: number, t?: number): ViewStyle => ({
  paddingHorizontal: h,
  paddingTop: t ?? v,
  paddingBottom: b ?? v,
})

export const centered: ViewStyle = {
  display: 'flex',
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

export const fullCon = (flex: 'row' | 'col' = 'col', isCentered: boolean = false): ViewStyle => ({
  ...fullWH,
  ...(flex === 'col' ? flexColumn : flexRow),
  ...(isCentered ? centered : {}),
})