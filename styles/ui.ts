import { ImageStyle, TextStyle, ViewStyle } from "react-native"
import Colors from "./colors"
import { basePadding, centered, flexColumnStretch, flexRowStretch, fullWH } from "./spacing"

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

export const photoSizeMap: Record<Size, ImageStyle> = {
  tiny: { width: 30, height: 30},
  xxSmall: { width: 40, height: 40},
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

export const iconSizeMap: Partial<Record<Size, ImageStyle>> = {
  xxSmall: { width: 15, height: 15},
  xSmall: { width: 20, height: 20},
  small: { width: 30, height: 30},
  med: { width: 40, height: 40},
  large: { width: 60, height: 60},
  xLarge: { width: 70, height: 70 },
}

export const icon = (size: string = 'small', m?: number): ImageStyle => ({
  ...iconSizeMap[size],
  margin: m ? m : (size === 'large' || size === 'xLarge' ? 5 : 2)
})

export const rounded = (direction: 'left' | 'right' | 'top' = 'top', rounded: number = 15): ViewStyle => ({
  borderTopLeftRadius: direction === 'left' || direction === 'top' ? rounded : 0,
  borderTopRightRadius: direction === 'right' || direction === 'top' ? rounded : 0,
  borderBottomLeftRadius: direction === 'left' ? rounded : 0,
  borderBottomRightRadius: direction === 'right' ? rounded : 0,
} )

export const form = (h: number = 10, b: number = 60, t: number = 0): ViewStyle => ({
  ...flexColumnStretch,
  ...basePadding(h, 0, b, t),
})

export const rowContent = (justify: any = 'space-between', h?: number, v?: number, m?: number): ViewStyle => ({
  ...flexRowStretch,
  ...basePadding(h, v),
  justifyContent: justify,
  margin: m,
})

export const tableRow = (withSeparator: boolean = true, withPadding: boolean = false, h?: number, v?: number): ViewStyle => ({
  ...(withPadding ? basePadding(h, v) : {}),
  ...(withSeparator ? { borderBottomWidth: 1 } : {}),
  borderColor: lightPalette().border,
  width: '100%',
})

export const overlay: ViewStyle = {
  ...fullWH,
  alignItems: 'center',
}

export const modalOverlay: ViewStyle = {
  flex: 1,
  position: 'relative',
  backgroundColor: Colors.transparent.semiLight,
}

export const bottomModal: ViewStyle = {
  // ...form(10, 60, 40),
  ...rounded(),
  ...boxShadow,
  marginTop: 'auto',
  backgroundColor: Colors.shadow.lightest,
}

export const card = (withPadding = true, withShadow = false, rounded: number = 8, m: number = 10, h?: number, v?: number): ViewStyle => ({
  ...centered,
  ...(withShadow ? boxShadow : {}),
  ...(withPadding ? basePadding(h, v) : {}),
  margin: m,
  borderRadius: rounded,
  backgroundColor: Colors.white,
})

export const roundedIconCon: ViewStyle = {
  ...centered,
  padding: 10,
  borderRadius: 99,
  backgroundColor: Colors.shadow.light,
}

export const inputBase = (h: number = 10, v: number = 15, m: number = 10): ViewStyle => ({
  ...basePadding(h, v),
  margin: m,
})

export const input = (withBorder: boolean = true, h?: number, v?: number, m: number = 0): ViewStyle => ({
  ...inputBase(h, v, m),
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

