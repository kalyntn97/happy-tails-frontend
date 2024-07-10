import { Image, ImageSourcePropType, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms, Typography } from "@styles/index"
import { FC, useEffect, useState } from "react"
import { transparent } from "@styles/buttons"
import { getActionIconSource } from "@utils/ui"

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

export const RoundButton = ({ onPress, size, bgColor, color, type, position }: RoundButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { backgroundColor: bgColor ?? Colors.pink.darkest },
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
        size === 'large'? { ...Forms.largeIcon } : size === 'small' ? { ...Forms.xSmallIcon } : { ...Forms.smallIcon },
      ]}
    />
  </TouchableOpacity>
)

interface IconButtonProps extends BaseButtonProps {
  type: string
  size: string
  height?: number
}

const iconButtonStyles = {
  'edit': { icon: 'edit', bgColor: Colors.yellow.light },
  'delete': { icon: 'deleteColor', bgColor: Colors.red.light },
  'details': { icon: 'details', bgColor: Colors.green.light },
}

export const IconButton = ({ onPress, type, size, height }: IconButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' && {...smallIconButtonStyles as ViewStyle},
    size === 'medium' && { 
      width: 50, height: height ?? 60, borderRadius: 10, marginHorizontal: 2, paddingVertical: 10,
      backgroundColor: iconButtonStyles[type].bgColor, alignItems: 'center', justifyContent: 'space-around',
    }
  ]}>
    <Image source={getActionIconSource(iconButtonStyles[type].icon)} style={[
      size === 'medium' && {...Forms.xSmallIcon},
      size === 'small' && {...Forms.xSmallIcon},
    ]} />
    { size === 'medium' && <Text style={{ fontSize: 10, textTransform: 'capitalize' }}>{type}</Text> }
  </TouchableOpacity>
)

interface PhotoButtonProps extends BaseButtonProps {
  photo: string
  placeholder?: string
}

export const PhotoButton = ({ photo, onPress, size, placeholder }: PhotoButtonProps) => (
  <TouchableOpacity onPress={onPress} style={{ margin: 5 }}>
    <View style={[size === 'small' ? { ...Forms.xxSmallPhoto } : { ...Forms.xSmallPhoto }, { backgroundColor: Colors.pink.light, ...Spacing.centered }]}>
      <Image source={photo ? { uri: photo } : placeholder} style={size === 'small' ? { ...Forms.xxSmallPhoto } : { ...Forms.xSmallPhoto }} />
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

export const MainButton= ({ onPress, title, top, bottom, bgColor, color, size, icon }: BaseWithIconButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { backgroundColor: bgColor ?? Colors.pink.reg },
    size === 'small' ? { ...Buttons.xSmallRoundButton } 
    : size === 'smallSquare' ? { ...Buttons.xSmallSquareButton } 
    : size === 'large' ? { ...Buttons.longSquareSolid } 
    : { ...Buttons.smallRoundedSolid },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    {icon && <Image source={getActionIconSource(icon)} style={{ ...Forms.smallIcon, marginRight: 5 }} /> }
    <Text style={[
      { ...Buttons.buttonText, color: color ?? Colors.shadow.darkest }, 
      icon ? { fontSize: size === 'large' ? 15 : 12 } : { fontSize: size === 'large' ? 20 : 15 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const TransparentButton= ({ title, onPress, size, top, bottom, color, bgColor, bdColor, icon }: BaseWithIconButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Spacing.flexRow, borderColor: bdColor ?? Colors.shadow.darkest, backgroundColor: bgColor ?? 'transparent', },
    size === 'small' ? { ...Buttons.xSmallRoundedTransparent } 
      : size === 'large' ? { ...Buttons.longRoundedTransparent }
      : { ...Buttons.smallRoundedTransparent },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    {icon && <Image source={getActionIconSource(icon)} style={[
      { marginRight: 5 }, size === 'small' ? Forms.xSmallIcon : Forms.smallIcon
    ]} />}
    <Text style={[
      { ...Buttons.buttonText, color: color ?? Colors.shadow.darkest, fontSize: icon ? 12 : 15 },
      // size === 'small' && { fontSize: icon ? 12 : 15 },
      size === 'large' && { fontSize: icon ? 15 : 20 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const SubButton = ({ onPress, title, color, top, bottom, size }: BaseButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Buttons.subButton, borderColor: color ?? Colors.shadow.darkest },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
    size === 'small' && { marginTop: 5 },
  ]}>
    <Text style={[
      { ...Buttons.buttonText, color: color ?? Colors.shadow.darkest,},
      size === 'small' && { fontSize: 13 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const GoBackButton = ({ onPress, top, left, position }: CornerButtonProps) => (
  <TouchableOpacity onPress={onPress} style={[
    position === 'topLeft' && { position: 'absolute', top: top ?? 5, left: left ?? 5,
  }]}>     
    <Image source={getActionIconSource('back')} style={{
      ...Forms.smallIcon,
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

export const StatButton = ({ header, stat, iconUri, body, bgColor, color, size, onPress, disabled }: StatButtonProps) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={[
    { ...Spacing.flexColumn, justifyContent: 'space-evenly', borderRadius: 15, backgroundColor: bgColor ?? Colors.white, padding: 10 },
    size === 'large' ? { width: 90, height: 110 } : { width: 80 , height: 95 }
  ]}>
    <Text style={{ fontSize: size === 'large' ? 15 : 12, marginBottom: 2, }}>{header}</Text>
    { !iconUri && 
      <Text style={{ fontSize: size === 'large' ? 22 : 18, fontWeight: 'bold', marginVertical: 2, color: stat === 0 ? Colors.red.dark : color ? color : 'black' }}>
        {stat >= 0 && stat !== Infinity ? stat : '?'}
      </Text> 
    }
    { iconUri && <Image source={iconUri as ImageSourcePropType} style={{ ...Forms.smallIcon, margin: 0 }}/> }
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

export const ToggleButton = ({ onPress, size, initial, bgColor }: CheckboxButtonProps) => {
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
      ...Spacing.flexRow, borderRadius: 30, backgroundColor: bgColor ?? Colors.shadow.light, padding: 2
    }}>
      <View style={[circleStyles, !on && { backgroundColor: Colors.shadow.lightest }]} />
      <View style={[circleStyles, on && { backgroundColor: Colors.green.reg }]} />            
    </Pressable>
  )
}

