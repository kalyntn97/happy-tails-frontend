import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { IconType, getActionIconSource, getIconByType } from "@utils/ui"
import { memo, ReactNode, useMemo } from "react"
import { Image, ImageSourcePropType, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
//components
import { circleBase } from "@styles/buttons"
//styles
import { Buttons, Colors, Spacing, Typography, UI } from "@styles/index"
import { Size } from "@styles/ui"

export type ButtonSize = Size | 'largeSquare' | 'smallSquare'

type BaseButtonProps = {
  title?: any
  icon?: string
  onPress?: () => void
  size?: ButtonSize,
  buttonStyles?: ViewStyle
  textStyles?: TextStyle
  bgColor?: string
  color?: string
  bdColor?: string
  position?: 'topRight' | 'bottomRight' | 'topLeft'
  h?: number
  v?: number
  disabled?: boolean
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
  small: { button: Buttons.smallRoundButton, text: 15 },
  med: { button: Buttons.mediumRoundButton, text: 20 },
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
      <Text style={[{ fontSize: textSize, color: color }, textStyles]}>{roundButtonTypes[type]}</Text>
    </TouchableOpacity>
  )
})

export const baseButtonSizeMap = {
  xSmall: [Buttons.xxSmall, Buttons.rounded],
  small: [Buttons.xSmall, Buttons.rounded],
  smallSquare: [Buttons.xSmall, Buttons.square],
  med: [Buttons.small, Buttons.rounded],
  large: [Buttons.long, Buttons.rounded],
  largeSquare: [Buttons.long, Buttons.square],
}

const baseButtonTextSizeMap = (n: number = 0) => ({
  small: 13 - n / 2,
  large: 18 - n ,
})

export const MainButton= memo(({ onPress, title, bgColor = UI.lightPalette().lightAccent, color = UI.lightPalette().button, bdColor = 'transparent', size = 'med', icon, h = 0, v = 0, buttonStyles, textStyles, disabled }: BaseButtonProps) => {
  const sizes = useMemo(() => {
    const buttonSize = baseButtonSizeMap[size]
    const textSize = size === 'large' || size === 'largeSquare' ? 'large' : 'small'
    const iconSize = size === 'large' || size === 'largeSquare' ? 'small' : 'xSmall'
    const textSizeAdjusted = icon ? baseButtonTextSizeMap(5)[textSize] : baseButtonTextSizeMap()[textSize]
    return { buttonSize, iconSize, textSizeAdjusted }
  }, [size])

  return (
    <AnimatedButton disabled={disabled} scaleFactor={0.9} withOpacity={true} onPress={onPress}>
      <View style={[sizes.buttonSize, Buttons.solid, Spacing.flexRow,
        { backgroundColor: bgColor, borderColor: bdColor, marginHorizontal: h, marginVertical: v, opacity: disabled ? 0.5 : 1 },
        buttonStyles,
      ]}>
        { icon && <Image source={getActionIconSource(icon)} style={[UI.icon(sizes.iconSize), { marginRight: 5 }]} /> }
        <Text style={[Buttons.buttonText, { fontSize: sizes.textSizeAdjusted, color: color }, textStyles]}>
        { title }
        </Text>
      </View>
    </AnimatedButton>
  )
})

export const TransparentButton= ({ title, icon, onPress, size = 'med', color = Colors.shadow.darkest, bdColor, bgColor = 'transparent', h, v, buttonStyles, textStyles, disabled }: BaseButtonProps) => (
<MainButton title={title} icon={icon} onPress={onPress} disabled={disabled} size={size} h={h} v={v} color={color} bdColor={bdColor ?? color} bgColor={bgColor} buttonStyles={{ ...Buttons.transparent, borderWidth: size === 'xSmall' || size === 'small' ? 1 : 1.5, ...buttonStyles }} textStyles={textStyles} />
)

export const SubButton = memo(({ onPress, title, color = UI.lightPalette().button, h, v, size = 'small', textStyles, disabled }: BaseButtonProps) => {
  const textSize = useMemo(() => baseButtonTextSizeMap(size === 'xSmall' ? 2 : 0)[size], [size])

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[Buttons.sub, { borderColor: color, marginHorizontal: h, marginVertical: v },
    ]}>
      <Text style={[Buttons.buttonText, {  fontSize: textSize, color: color }, textStyles]}>{title}</Text>
    </TouchableOpacity>
  )
})

const iconButtonSizeMap = {
  small: { width: 40, minHeight: 60 },
  medium: { width: 50, minHeight: 70 },
  large: { width: 60, minHeight: 80 },
  xLarge: { width: 70, minHeight: 90 },
}

export const IconButton = memo(({ title, type, icon, onPress, size, buttonStyles, textStyles, disabled }: ButtonWithTypeProps) => {
  const sizes = useMemo(() => {
    const buttonSize: ViewStyle = iconButtonSizeMap[size]
    const iconSize: string = size === 'xLarge' ? 'large' : size === 'large' ? 'med' : 'xSmall'
    const textSize: number = size === 'xLarge' || size === 'large' ? 13 : 10
    return { buttonSize, iconSize, textSize }
  }, [size])

  const iconSource = useMemo(() => {
  const iconName = icon ?? title
    return getIconByType(type as IconType, iconName)
}, [type, icon, title])
  
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[
      UI.input(true, 10, 10, 5), sizes.buttonSize,
    { justifyContent: title ? 'space-around' : 'center', alignItems: 'center' },
      buttonStyles
    ]}>
      <Image source={iconSource} style={UI.icon(sizes.iconSize)} />
      { title && <Text style={[{ fontSize: sizes.textSize, textTransform: 'capitalize', marginTop: 5 }, textStyles]}>{title}</Text> }
    </TouchableOpacity>
  )
})

export const ActionButton= memo(({ title, icon, onPress, size = 'small', buttonStyles, textStyles, position, h, v, disabled }: BaseButtonProps) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[Spacing.flexRow, Spacing.centered, buttonStyles,
    position && positionMap(h, v)[position] as ViewStyle,
  ]}>
    { icon && <Image source={getActionIconSource(icon)} style={UI.icon(size)} /> }
    { title && <Text style={[{ marginLeft: 10 }, textStyles]}>{title}</Text> }
  </TouchableOpacity>
))

export const CloseButton = ({ onPress, position = 'topRight', size = 'small', buttonStyles }: BaseButtonProps) => (
  <ActionButton icon='close' onPress={onPress} position={position} size={size} buttonStyles={buttonStyles} />
)

export const GoBackButton = ({ onPress, position = 'topLeft', size = 'small', buttonStyles }: BaseButtonProps) => (
  <ActionButton icon='back' position={position} onPress={onPress} size={size} buttonStyles={buttonStyles} />
)

interface PhotoButtonProps extends BaseButtonProps {
  photo: string
  placeholder?: string
}

export const PhotoButton = memo(({ photo, onPress, size = 'small', placeholder, bgColor = Colors.pink.light, disabled, buttonStyles }: PhotoButtonProps) => {
  const defaultPhoto = useMemo(() => placeholder ?? require('@assets/icons/ui-image.png'), [placeholder])

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[UI.photo(size, 99, 0), Spacing.centered, { backgroundColor: bgColor }, buttonStyles]}>
      <Image source={photo ? { uri: photo } : defaultPhoto as ImageSourcePropType} style={UI.photo(size, 99, 0)} />
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

export const StatButton = ({ header, stat, iconUri, body, bgColor, color = Colors.black, size, onPress, disabled, buttonStyles }: StatButtonProps) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={[Spacing.flexColumn, Buttons.main,
    { width: size === 'large' ? 80 : 100, justifyContent: 'space-evenly', borderRadius: 15, backgroundColor: bgColor ?? Colors.white, padding: 10 },
    buttonStyles,
  ]}>
    <Text style={{ fontSize: size === 'large' ? 15 : 12, marginBottom: 10 }}>{header}</Text>
    { !iconUri && 
      <Text style={{ fontSize: size === 'large' ? 22 : 18, fontWeight: 'bold', marginVertical: 2, color: stat === 0 ? Colors.red.dark : color }}>
        {stat >= 0 && stat !== Infinity ? stat : '?'}
      </Text> 
    }
    { iconUri && <Image source={iconUri as ImageSourcePropType} style={[UI.icon(), { margin: 0 }]} /> }
    <Text style={Typography.smallBody}>{body}</Text>
  </TouchableOpacity>
)

interface ToggleButtonProps extends BaseButtonProps { isOn: boolean, switchColor?: string, width?: number }

export const CheckBoxButton = memo(({ isChecked, onPress, color, bgColor }: BaseButtonProps & { isChecked: boolean }) => (
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

export const ToggleButton = memo(({ isOn, onPress, size = 'small' , bgColor = Colors.shadow.light, switchColor = Colors.green.reg, disabled }: ToggleButtonProps) => {
  const width = useMemo(() => widthMap[size], [size])

  return (
    <Pressable onPress={onPress} disabled={disabled} style={[Spacing.flexRow, { width: width * 1.7, height: width + padding * 2, borderRadius: 30, backgroundColor: bgColor, padding: padding, justifyContent: isOn ? 'flex-start' : 'flex-end' }]}>
      <View style={[circleBase, { width: width, height: width, backgroundColor: isOn ? switchColor : Colors.shadow.lightest }]} />
    </Pressable>
  )
})

export const AnimatedButton = ({ scaleFactor, withOpacity = false, onPress, index, children, disabled = false }: { scaleFactor: number, withOpacity?: boolean, onPress: (index?: number) => void, index?: number, children: ReactNode, disabled?: boolean }) => {
  const scale = useSharedValue<number>(1)
  const opacity = useSharedValue<number>(1)

  const animatedBtnStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value}],
    opacity: opacity.value,
  }))

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(scaleFactor)
      opacity.value = withOpacity ? withSpring(0.3) : 1
    })
    .onFinalize(() => {
      scale.value = withSpring(1)
      opacity.value = withOpacity ? withSpring(1) : 1
      runOnJS(onPress)(index)
    })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedBtnStyles}>
        { children }
      </Animated.View> 
    </GestureDetector>
  )
}

