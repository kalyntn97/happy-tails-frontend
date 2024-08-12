import { Image, ImageSourcePropType, Pressable, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, UI, Typography } from "@styles/index"
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react"
import { getActionIconSource, getHealthIconSource, getPetIconSource } from "@utils/ui"
import { lightPalette } from "@styles/ui"
import { circleBase } from "@styles/buttons"

type BaseButtonProps = {
  title?: any
  icon?: string
  onPress?: () => void
  size?: string
  buttonStyles?: ViewStyle
  textStyles?: TextStyle
  bgColor?: string
  color?: string
  bdColor?: string
  position?: 'topRight' | 'bottomRight' | 'topLeft'
  h?: number
  v?: number
}

interface ButtonWithTypeProps extends BaseButtonProps { type: string }

const absolute = { position: 'absolute', zIndex: 2 }
const positionMap = (h: number = 10, v: number = 10) => ({
  bottomRight: { ...absolute, bottom: v, right: h },
  topRight: { ...absolute, top: v, right: h },
  topLeft: { ...absolute, top: v, left: h },
})

const roundButtonTypes = {
  add: '+',
  remove: '−',
}
const roundButtonSizeMap = {
  small: { button: Buttons.smallRoundButton, text: 9 },
  medium: { button: Buttons.mediumRoundButton, text: 20 },
  large: { button: Buttons.roundButton, text: 30 },
}

export const RoundButton = memo(({ onPress, size = 'large', bgColor = Colors.pink.darkest, color = 'white', type, position, buttonStyles, textStyles }: ButtonWithTypeProps) => { 
  const buttonSize = useMemo(() => roundButtonSizeMap[size].button, [size])
  const textSize = useMemo(() => roundButtonSizeMap[size].text, [size])
  
  return (
    <TouchableOpacity onPress={onPress} style={[buttonSize, { backgroundColor: bgColor },
      position && positionMap()[position],
      buttonStyles
    ]}>
      <Text style={[textSize, { color: color }, textStyles]}>{roundButtonTypes[type]}</Text>
    </TouchableOpacity>
  )
})

const iconSizeMap = {
  xSmall: UI.xSmallIcon,
  small: UI.smallIcon,
  medium: UI.icon,
  large: UI.largeIcon,
}

export const ActionButton= memo(({ title, icon, onPress, size = 'xSmall', buttonStyles, textStyles, position, h, v }: BaseButtonProps) => {
  const iconSize = useMemo(() => iconSizeMap[size], [size])
  
  return (
    <TouchableOpacity onPress={onPress} style={[Spacing.flexRow, Spacing.centered, buttonStyles,
      position && positionMap(h, v)[position] as ViewStyle,
    ]}>
      <Image source={getActionIconSource(icon)} style={iconSize} />
      { title && <Text style={[{ marginLeft: 10 }, textStyles]}>{title}</Text> }
    </TouchableOpacity>
  )
})

export const CloseButton = ({ onPress, position = 'topRight', size = 'small', buttonStyles }: BaseButtonProps) => (
  <ActionButton icon='close' onPress={onPress} position={position} size={size} buttonStyles={buttonStyles} />
)

interface ButtonWithLayoutProps extends BaseButtonProps { top?: number }

export const GoBackButton = ({ onPress, position = 'topLeft', size = 'small', buttonStyles, top }: ButtonWithLayoutProps) => (
  <ActionButton icon='back' position={position} v={top} onPress={onPress} size={size} buttonStyles={buttonStyles} />
)

export const IconButton = memo(({ title, icon, onPress, type, size, buttonStyles }: ButtonWithTypeProps) => {
  const buttonSize: ViewStyle = useMemo(() => {
    const sizeMap = {
      small: { width: 40, height: 60 },
      medium: { width: 50, height: 70 },
      large: { width: 60, height: 90 },
    }
    return sizeMap[size]
  }, [size])

  const getIconSource = useCallback((name: string) => {
    const map = {
      action: () => getActionIconSource(name),
      health: () => getHealthIconSource(name),
      pet: () => getPetIconSource(name),
    }
    return map[type]()
  }, [type])

  const iconName = icon ?? title
  const iconSource = getIconSource(iconName)
  
  return (
    <TouchableOpacity onPress={onPress} style={[
      { padding: 10, margin: 5, borderRadius: size === 'small' ? 8 : 10, justifyContent: title ? 'space-around' : 'center', alignItems: 'center', borderWidth: 1, borderColor: lightPalette().border, },
      buttonSize, buttonStyles
    ]}>
      <Image source={iconSource} style={size === 'large' ? UI.icon : UI.xSmallIcon} />
      { title && <Text style={{ fontSize: size === 'medium' ? 10 : 13, textTransform: 'capitalize' }}>{title}</Text> }
    </TouchableOpacity>
  )
})

interface PhotoButtonProps extends BaseButtonProps {
  photo: string
  placeholder?: string
}

const photoSizeMap = {
  small: UI.xxSmallPhoto,
  medium: UI.xSmallPhoto,
}

export const PhotoButton = memo(({ photo, onPress, size = 'small', placeholder, bgColor = Colors.pink.light }: PhotoButtonProps) => {
  const photoSize = useMemo(() => photoSizeMap[size], [size])
  const defaultPhoto = useMemo(() => placeholder ?? require('@assets/icons/ui-image.png'), [placeholder])

  return (
  <TouchableOpacity onPress={onPress} style={{ margin: 5 }}>
    <View style={[photoSize, Spacing.centered, { backgroundColor: bgColor }]}>
      <Image source={photo ? { uri: photo } : defaultPhoto as ImageSourcePropType} style={photoSize} />
    </View>
  </TouchableOpacity>
  ) 
})

const baseButtonSizeMap = {
  small: [Buttons.xSmall, Buttons.rounded],
  smallSquare: [Buttons.xSmall, Buttons.square],
  medium: [Buttons.small, Buttons.rounded],
  large: [Buttons.long, Buttons.rounded],
  largeSquare: [Buttons.long, Buttons.square],
}

const baseButtonTextSizeMap = (n: number = 0) => ({
  small: { fontSize: 15 - n / 2 },
  large: { fontSize: 20 - n },
})

export const MainButton= memo(({ onPress, title, bgColor = Colors.pink.reg, color = UI.lightPalette().button, bdColor = 'transparent', size, icon, h = 0, v = 0, buttonStyles, textStyles }: BaseButtonProps) => {
  const buttonSize = useMemo(() => baseButtonSizeMap[size], [size])
  const textSize = useMemo(() => icon ? baseButtonTextSizeMap(5)[size] : baseButtonTextSizeMap()[size], [size])

  return (
    <TouchableOpacity onPress={onPress} style={[buttonSize, Buttons.solid, Spacing.flexRow,
      { backgroundColor: bgColor, borderColor: bdColor, marginHorizontal: h, marginVertical: v },
      buttonStyles
    ]}>
      {icon && <Image source={getActionIconSource(icon)} style={[UI.smallIcon, { marginRight: 5 }]} /> }
      <Text style={[Buttons.buttonText, textSize, {  color: color }, textStyles]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
})

export const TransparentButton= ({ title, icon, onPress, size = 'medium', color = UI.lightPalette().button, bdColor = UI.lightPalette().button, bgColor = 'transparent', h, v }: BaseButtonProps) => (
  <MainButton title={title} icon={icon} onPress={onPress} size={size} h={h} v={v} color={color} bdColor={bdColor} bgColor={bgColor} buttonStyles={Buttons.transparent} />
)

export const SubButton = memo(({ onPress, title, color = UI.lightPalette().button, h, v, size = 'small', textStyles }: BaseButtonProps) => {
  const textSize = useMemo(() => baseButtonTextSizeMap()[size], [size])

  return (
    <TouchableOpacity onPress={onPress} style={[Buttons.sub, { borderColor: color, marginHorizontal: h, marginVertical: v },
    ]}>
      <Text style={[Buttons.buttonText, textSize, {  color: color }, textStyles]}>{title}</Text>
    </TouchableOpacity>
  )
})

interface StatButtonProps extends BaseButtonProps {
  header: string
  stat?: number
  iconUri?: any
  body: string
  disabled?: boolean
}

export const StatButton = ({ header, stat, iconUri, body, bgColor, color = Colors.black, size, onPress, disabled }: StatButtonProps) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={[
    { ...Spacing.flexColumn, justifyContent: 'space-evenly', borderRadius: 15, backgroundColor: bgColor ?? Colors.white, padding: 10 },
    size === 'large' ? { width: 90, height: 110 } : { width: 80 , height: 95 }
  ]}>
    <Text style={{ fontSize: size === 'large' ? 15 : 12, marginBottom: 2, }}>{header}</Text>
    { !iconUri && 
      <Text style={{ fontSize: size === 'large' ? 22 : 18, fontWeight: 'bold', marginVertical: 2, color: stat === 0 ? Colors.red.dark : color }}>
        {stat >= 0 && stat !== Infinity ? stat : '?'}
      </Text> 
    }
    { iconUri && <Image source={iconUri as ImageSourcePropType} style={{ ...UI.smallIcon, margin: 0 }}/> }
    <Text style={{ ...Typography.xSmallBody }}>{body}</Text>
  </TouchableOpacity>
)

interface ToggleButtonProps extends BaseButtonProps { isChecked: boolean, switchColor?: string, width?: number }

export const CheckBoxButton = memo(({ isChecked, onPress, color, bgColor }: ToggleButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[Spacing.centered, 
    { width: 20, height: 20, borderRadius: 4, borderWidth: 1, marginLeft: 10, backgroundColor: bgColor, borderColor: bgColor },
  ]}>
    <Text style={{ fontSize: 15, fontWeight: 'bold', color: color }}>
      {isChecked ? '✓' : ''}
    </Text>
  </TouchableOpacity>
))

const widthMap = {
  small: 20,
  medium: 30,
  large: 40,
}
const padding = 2

export const ToggleButton = memo(({ isChecked, onPress, size = 'small' , bgColor = Colors.shadow.light, switchColor = Colors.green.reg }: ToggleButtonProps) => {
  const width = useMemo(() => widthMap[size], [size])

  return (
    <Pressable onPress={onPress} style={[Spacing.flexRow, { width: width * 1.7, height: width + padding * 2, borderRadius: 30, backgroundColor: bgColor, padding: padding, justifyContent: isChecked ? 'flex-start' : 'flex-end' }]}>
      <View style={[circleBase, { width: width, height: width, backgroundColor: isChecked ? switchColor : Colors.shadow.lightest }]} />
    </Pressable>
  )
})



