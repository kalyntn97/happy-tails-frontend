import { Image, ImageSourcePropType, Pressable, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, UI, Typography } from "@styles/index"
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react"
import { getActionIconSource, getHealthIconSource, getPetIconSource } from "@utils/ui"
import { lightPalette } from "@styles/ui"

const smallIconButtonStyles: ViewStyle = {
  marginHorizontal: 5,
}

type BaseButtonProps = {
  title?: any
  onPress?: () => void
  top?: number | 'auto'
  bottom?: number | 'auto'
  left?: number | 'auto'
  bgColor?: string
  color?: string
  bdColor?: string
  size?: string
}

interface RoundButtonProps extends BaseButtonProps {
  type: string
  position?: 'bottomRight'
}
const roundButtonTypes = {
  'add' : '+',
  'remove': '−',
}

export const RoundButton = ({ onPress, size, bgColor = Colors.pink.darkest, color, type, position }: RoundButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { backgroundColor: bgColor },
    size === 'small' ? { ...Buttons.smallRoundButton as ViewStyle, margin: 0 } : size === 'medium' ? { ...Buttons.mediumRoundButton as ViewStyle } : { ...Buttons.roundButton as ViewStyle },
    position === 'bottomRight' && { position: 'absolute', bottom: 10, right: 10, zIndex: 2, }
  ]}>
    <Text style={[
      { ...Buttons.whiteButtonText, fontSize: size === 'small' ? 9 : size === 'medium' ? 20 : 30 },
      color && { color: color },
    ]}>
      {roundButtonTypes[type]}
    </Text>
  </TouchableOpacity>
)

export const ActionButton= ({ title, onPress, size, top, left }: BaseButtonProps) => (
  <TouchableOpacity onPress={onPress} style={ left && { marginLeft: left } }>
    <Image 
      source={getActionIconSource(title)}
      style={[
        { marginHorizontal: 10, marginLeft: 'auto' },
        size === 'large'? { ...UI.largeIcon } : size === 'small' ? { ...UI.xSmallIcon } : { ...UI.smallIcon },
      ]}
    />
  </TouchableOpacity>
)

interface IconButtonProps extends BaseButtonProps {
  title?: string
  icon?: string
  type: string
  size: string
  styles?: ViewStyle
}

export const IconButton = memo(({ title, icon, onPress, type, size, styles }: IconButtonProps) => {
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
      { padding: 10, marginHorizontal: 5, borderRadius: size === 'small' ? 8 : 10, justifyContent: title ? 'space-around' : 'center', alignItems: 'center', flex: 1, borderWidth: 1, borderColor: lightPalette.border, },
      buttonSize,
      styles
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

export const PhotoButton = ({ photo, onPress, size, placeholder }: PhotoButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{ margin: 5 }}>
    <View style={[size === 'small' ? { ...UI.xxSmallPhoto } : { ...UI.xSmallPhoto }, { backgroundColor: Colors.pink.light, ...Spacing.centered }]}>
      <Image source={photo ? { uri: photo } : placeholder as ImageSourcePropType} style={size === 'small' ? { ...UI.xxSmallPhoto } : { ...UI.xSmallPhoto }} />
    </View>
  </TouchableOpacity>
)

interface CornerButtonProps extends BaseButtonProps {
  position?: string
  top?: number
  left?: number
  right?: number
  bottom?: number
}

export const CloseButton = ({ onPress, size, position }: CornerButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[position === 'topRight' && { position: 'absolute', top: 10, right: 10 }, { zIndex: 1 }]}>
    <Image source={getActionIconSource('close')} style={[
      size === 'small' ? { width: 25, height: 25, margin: 5 } 
      : size === 'xSmall' ? { width: 15, height: 15, margin: 2 } : { width: 40, height: 40, margin: 10 },
    ]} />
  </TouchableOpacity>
)

interface BaseWithIconButtonProps extends BaseButtonProps {
  icon?: string
}

export const MainButton= ({ onPress, title, top, bottom, bgColor = Colors.pink.reg, color = UI.lightPalette.button, size, icon }: BaseWithIconButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { backgroundColor: bgColor },
    size === 'small' ? { ...Buttons.xSmallRoundButton } 
    : size === 'smallSquare' ? { ...Buttons.xSmallSquareButton } 
    : size === 'large' ? { ...Buttons.longSquareSolid } 
    : { ...Buttons.smallRoundedSolid },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    {icon && <Image source={getActionIconSource(icon)} style={{ ...UI.smallIcon, marginRight: 5 }} /> }
    <Text style={[
      { ...Buttons.buttonText, color: color }, 
      icon ? { fontSize: size === 'large' ? 15 : 12 } : { fontSize: size === 'large' ? 20 : 15 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const TransparentButton= ({ title, onPress, size = 'medium', top, bottom, color = UI.lightPalette.button, bdColor = UI.lightPalette.button, bgColor = 'transparent', icon }: BaseWithIconButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Spacing.flexRow, borderColor: bdColor, backgroundColor: bgColor, },
    size === 'small' ? { ...Buttons.xSmallRoundedTransparent } 
      : size === 'large' ? { ...Buttons.longRoundedTransparent }
      : { ...Buttons.smallRoundedTransparent },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    {icon && <Image source={getActionIconSource(icon)} style={[
      { marginRight: 5 }, size === 'small' ? UI.xSmallIcon : UI.smallIcon
    ]} />}
    <Text style={[
      { ...Buttons.buttonText, color: color, fontSize: icon ? 12 : 15 },
      size === 'large' && { fontSize: icon ? 15 : 20 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const SubButton = ({ onPress, title, color = UI.lightPalette.button, top, bottom, size }: BaseButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Buttons.subButton, borderColor: color },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
    size === 'small' && { marginTop: 5 },
  ]}>
    <Text style={[
      { ...Buttons.buttonText, color: color },
      size === 'small' && { fontSize: 13 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const GoBackButton = ({ onPress, top = 5, left = 5, position }: CornerButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    position === 'topLeft' && { position: 'absolute', top: top, left: left,
  }]}>     
    <Image source={getActionIconSource('back')} style={{
      ...UI.smallIcon,
    }}
    />
  </TouchableOpacity>
)

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

interface CheckboxButtonProps extends BaseButtonProps {
  initial: boolean
}

export const CheckboxButton = ({ onPress, size, initial, bgColor, color }: CheckboxButtonProps) => {
  const [check, setCheck] = useState<boolean>(initial)

  const handlePress = () => {
    setCheck(!check)
    onPress()
  }

  useEffect(() => {
    setCheck(initial)
  }, [initial])

  return (  
    <TouchableOpacity onPress={handlePress} style={[
      { width: 20, height: 20, borderRadius: 4, borderWidth: 1, ...Spacing.centered, marginLeft: 10 },
      bgColor && { backgroundColor: bgColor, borderColor: bgColor },
    ]}>
      <Text style={[
        { fontSize: size === 'small' ? 10 : 15, fontWeight: 'bold' }, color && { color: color }
      ]}>
        {check ? '✓' : ''}
      </Text>
    </TouchableOpacity>
  )
}

export const ToggleButton = ({ onPress, size, initial, bgColor = Colors.shadow.light }: CheckboxButtonProps) => {
  const [on, setOn] = useState<boolean>(initial)

  const handlePress = () => {
    onPress()
    setOn(!on)
  }

  const circleStyles = {
    borderRadius: 99, width: size === 'small' ? 20 : size === 'large' ? 40 : 30, height: size === 'small' ? 20 : size === 'large' ? 40 : 30,
  }

  useEffect(() => {
    setOn(initial)
  }, [initial])

  return (
    <Pressable onPress={handlePress} style={{
      ...Spacing.flexRow, borderRadius: 30, backgroundColor: bgColor, padding: 2
    }}>
      <View style={[circleStyles, !on && { backgroundColor: Colors.shadow.lightest }]} />
      <View style={[circleStyles, on && { backgroundColor: Colors.green.reg }]} />            
    </Pressable>
  )
}

