import { ImageStyle, TextStyle, ViewStyle } from "react-native"
import Colors from "./colors"
import { basePadding, centered, flexColumn, flexRow, fullWH } from "./spacing"

export type AccentColor = 'shadow' | 'pink' | 'yellow' | 'purple' | 'green' | 'blue' | 'red'
export type Size = 'tiny' | 'xxSmall' | 'xSmall' | 'small' | 'med' | 'large' | 'xLarge'

export const lightPalette = (accent: AccentColor = 'pink') => ({
  text: Colors.black,
  button: Colors.black,
  focused: Colors[accent].darkest,
  unfocused: Colors.shadow.dark,
  border: Colors.shadow.reg,
  accent: Colors[accent].dark,
  lightAccent: Colors[accent].light,
  background: Colors.shadow.lightest,
  error: Colors.red.dark,
})

export const boxShadow: ViewStyle = {
  elevation: 3,
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
}

export const card = (withShadow: boolean = true): ViewStyle => ({
  ...centered,
  ...(withShadow ? boxShadow : {}),
  ...basePadding(),
  margin: 10,
  borderRadius: 15,
  backgroundColor: lightPalette().background,
})

export const photoSizeMap: Record<Size, ImageStyle> = {
  tiny: { width: 20, height: 20},
  xxSmall: { width: 30, height: 30},
  xSmall: { width: 50, height: 50},
  small: { width: 70, height: 70},
  med: { width: 80, height: 80},
  large: { width: 120, height: 120},
  xLarge: { width: 150, height: 150},
}

export const photo = (size: string = 'med', r: number = 99, m: number = 5): ImageStyle => ({
  ...photoSizeMap[size],
  borderRadius: r,
  margin: m,
})

const iconSizeMap: Partial<Record<Size, ImageStyle>> = {
  xSmall: { width: 20, height: 20},
  small: { width: 30, height: 30},
  med: { width: 40, height: 40},
  large: { width: 60, height: 60},
  xLarge: { width: 80, height: 80 },
}

export const icon = (size: string = 'small'): ImageStyle => ({
  ...iconSizeMap[size],
  margin: size === 'large' || size === 'xLarge' ? 5 : 2
})

export const rounded = (direction: 'left' | 'right' | 'top' = 'top', rounded: number = 15): ViewStyle => ({
  borderTopLeftRadius: direction === 'left' || direction === 'top' ? rounded : 0,
  borderTopRightRadius: direction === 'right' || direction === 'top' ? rounded : 0,
  borderBottomLeftRadius: direction === 'left' ? rounded : 0,
  borderBottomRightRadius: direction === 'right' ? rounded : 0,
} )

export const form = (h: number = 10, b: number = 60, t: number = 0): ViewStyle => ({
  ...flexColumn,
  ...basePadding(h, 0, b, t),
  width: '100%',
})

export const rowContent = (withColumn: boolean = false, justify: any = 'space-between', h?: number, v?: number, m?: number): ViewStyle => ({
  ...flexRow,
  ...basePadding(h, v),
  width: '100%',
  justifyContent: withColumn ? 'center' : justify,
  margin: m,
})

export const tableRow = (withSeparator: boolean = false): ViewStyle => ({
  width: '100%',
  borderBottomWidth: withSeparator ? 1 : 0,
  borderColor: lightPalette().border,
})

export const overlay: ViewStyle = {
  ...fullWH,
  alignItems: 'center',
}

export const modalOverlay: ViewStyle = {
  ...fullWH,
  ...centered,
  position: 'relative',
  backgroundColor: Colors.transparent.semiLight,
}

export const bottomModal: ViewStyle = {
  ...form(15, 60, 40),
  ...rounded(),
  ...boxShadow,
  marginTop: 'auto',
  backgroundColor: Colors.shadow.lightest,
}

export const roundedCon = (withPadding: boolean = true): ViewStyle => ({
  width: '90%',
  backgroundColor: Colors.white,
  borderRadius: 20,
  marginVertical: 10,
  ...(withPadding ? basePadding() : {}),
})

export const roundedIconCon: ViewStyle = {
  ...centered,
  padding: 10,
  borderRadius: 99,
  backgroundColor: Colors.shadow.light,
}

export const inputBase: ViewStyle = {
  ...basePadding(),
  marginVertical: 10,
}

export const input = (withBorder: boolean = true): ViewStyle => ({
  ...inputBase,
  borderRadius: 8,
  borderWidth: withBorder ? 1 : 0,
  borderColor: lightPalette().border,
})

export const successToast: ViewStyle = {
  backgroundColor: lightPalette().background,
}

export const active: ViewStyle = {
  opacity: 1,
  elevation: 3
}

export const inactive: ViewStyle = {
  opacity: 0.3,
}

export const focused: TextStyle = {
  borderColor: lightPalette().focused,
  color: lightPalette().focused,
}

export const unfocused: TextStyle = {
  borderColor: lightPalette().unfocused,
  color: lightPalette().text,
}

export const error: TextStyle = {
  borderColor: lightPalette().error,
  color: lightPalette().error,
}

