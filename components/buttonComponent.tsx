import { Image, ImageSourcePropType, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms, Typography } from "@styles/index"
import { FC, useEffect, useState } from "react"
import { transparent } from "@styles/buttons"
import { getActionIconSource } from "@utils/ui"

const whiteBtnTextStyles: TextStyle = {
  color: Colors.white,
  fontWeight: 'bold'
}

const smallIconButtonStyles: ViewStyle = {
  marginHorizontal: 5,
}

type BaseButtonProps = {
  title?: any
  onPress?: () => void
  top?: number | 'auto'
  bottom?: number | 'auto'
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

export const RoundButton: FC<RoundButtonProps> = ({ onPress, size, bgColor, color, type, position }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' ? { ...Buttons.smallRoundButton as ViewStyle, margin: 0 } : size === 'medium' ? { ...Buttons.mediumRoundButton as ViewStyle } : { ...Buttons.roundButton as ViewStyle },
    bgColor && { backgroundColor: bgColor },
    position === 'bottomRight' && { position: 'absolute', bottom: 10, right: 10, zIndex: 2, }
  ]}>
    <Text style={[
      { ...whiteBtnTextStyles, fontSize: size === 'small' ? 9 : size === 'medium' ? 20 : 30 },
      color && { color: color }
    ]}>
      {roundButtonTypes[type]}
    </Text>
  </TouchableOpacity>
)

export const ActionButton: FC<BaseButtonProps> = ({ title, onPress, size }) => (
  <TouchableOpacity onPress={onPress}>
    <Image 
      source={getActionIconSource(title)}
      style={[
        { marginHorizontal: 10 },
        size === 'large'? { ...Forms.largeIcon } : size === 'small' ? { ...Forms.xSmallIcon } : { ...Forms.smallIcon },
      ]}
    />
  </TouchableOpacity>
)

interface IconButtonProps extends BaseButtonProps {
  type: string
  size: string
}

const iconButtonStyles = {
  'edit': { bgColor: Colors.yellow.light },
  'delete': { bgColor: Colors.red.light },
  'details': { bgColor: Colors.green.light },
}

export const IconButton: FC<IconButtonProps> = ({ onPress, type, size }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' && {...smallIconButtonStyles as ViewStyle},
    size === 'medium' && { 
      width: 50, height: 60, borderRadius: 10, marginHorizontal: 2, paddingVertical: 10,
      backgroundColor: iconButtonStyles[type].bgColor, alignItems: 'center', justifyContent: 'space-around',
    }
  ]}>
    <Image source={getActionIconSource(type)} style={[
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

export const PhotoButton = ({ photo, onPress, size, placeholder }) => (
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

export const CloseButton: FC<CornerButtonProps> = ({ onPress, size, position }) => (
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

export const MainButton: FC<BaseWithIconButtonProps> = ({ onPress, title, top, bottom, bgColor, color, size, icon }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' ? { ...Buttons.xSmallRoundButton } 
    : size === 'smallSquare' ? { ...Buttons.xSmallSquareButton } 
    : size === 'large' ? { ...Buttons.longSquareSolid } 
    : { ...Buttons.smallRoundedSolid },
    { backgroundColor: bgColor ?? Colors.pink.reg },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    {icon && <Image source={getActionIconSource(icon)} style={{ ...Forms.smallIcon, marginRight: 5 }} /> }
    <Text style={[
      { ...Buttons.buttonText, fontSize: icon ? 12 : 15 }, 
      color && { color: color },
      // size === 'small' && { fontSize: icon ? 12 : 15 },
      size === 'large' && { fontSize: icon ? 15 : 20 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const TransparentButton: FC<BaseWithIconButtonProps> = ({ title, onPress, size, top, bottom, color, bgColor, bdColor, icon }) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Spacing.flexRow, borderColor: bdColor ?? Colors.transparent.dark, backgroundColor: bgColor ?? Colors.transparent.light, },
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

export const SubButton: FC<BaseButtonProps> = ({ onPress, title, color, top, bottom, size }) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Buttons.smallSubButton, borderColor: color ?? Colors.pink.darkest },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
    size === 'small' && { marginTop: 5 },
  ]}>
    <Text style={[
      { ...Buttons.buttonText, color: color ?? Colors.pink.darkest,},
      size === 'small' && { fontSize: 13 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const GoBackButton: FC<CornerButtonProps> = ({ onPress, top, left, position }) => (
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
  item: { header: string, stat?: number, iconUri?: any, body: string }
}

export const StatButton: FC<StatButtonProps> = ({ item, bgColor, color, onPress }) => (
  <Pressable onPress={onPress} style={{
    ...Spacing.flexColumn,
    borderRadius: 15,
    backgroundColor: bgColor ?? Colors.white,
    padding: 10,
    width: 71,
    height: 83,
  }}>
    <Text style={{
      fontSize: 12,
      fontStyle: 'italic',
      marginBottom: 2,
    }}>
      {item.header}
    </Text>

    {!item.iconUri && 
      <Text style={[{
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 2,
      }, { color: item.stat === 0 ? Colors.red.dark : color ? color : 'black' }
      ]}>
        {item.stat >= 0 && item.stat !== Infinity ? item.stat : '?'}
      </Text> 
    }
    
    {item.iconUri && 
      <Image source={item.iconUri as ImageSourcePropType} style={{
        ...Forms.smallIcon, margin: 0,
      }}/>
    }
    <Text style={{ ...Typography.xSmallBody }}>
      {item.body}
    </Text>
  </Pressable>
)

interface CheckboxButtonProps extends BaseButtonProps {
  initial: boolean
}

export const CheckboxButton: FC<CheckboxButtonProps> = ({ onPress, size, initial, bgColor, color }) => {
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

export const ToggleButton: FC<CheckboxButtonProps> = ({ onPress, size, initial, bgColor }) => {
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
      <View style={[circleStyles, !on && { backgroundColor: Colors.shadow.reg }]} />
      <View style={[circleStyles, on && { backgroundColor: Colors.green.reg }]} />            
    </Pressable>
  )
}

