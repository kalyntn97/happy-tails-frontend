import { TAB_BAR_HEIGHT } from "@navigation/NavigationStyles"
import { ViewStyle } from "react-native"

export const baseMargin = 10

export const basePadding: ViewStyle = {
  paddingVertical: 15,
  paddingHorizontal: 20,
}

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

export const scrollScreenDown: ViewStyle = {
  ...flexColumn,
  width: '100%',
  paddingHorizontal: 10,
  paddingBottom: 60,
}

export const scrollContent: ViewStyle = {
  ...flexColumn,
  width: '100%',
  paddingHorizontal: 10,
  paddingBottom: 20,
}