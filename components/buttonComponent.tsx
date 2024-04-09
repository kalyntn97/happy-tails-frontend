import { Image, ImageSourcePropType, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms, Typography } from "@styles/index"
import { FC, useState } from "react"
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
    size === 'small' ? { ...Buttons.smallRoundButton as ViewStyle } : { ...Buttons.roundButton as ViewStyle },
    bgColor && { backgroundColor: bgColor },
    position === 'bottomRight' && { position: 'absolute', bottom: 10, right: 10, zIndex: 2, }
  ]}>
    <Text style={[
      { ...whiteBtnTextStyles, fontSize: size === 'small' ? 15 : 30 },
      color && { color: color }
    ]}>
      {roundButtonTypes[type]}
    </Text>
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
      width: 40, height: 60, borderRadius: 10, marginHorizontal: 2,
      backgroundColor: iconButtonStyles[type].bgColor, ...Spacing.centered,
    }
  ]}>
    <Image source={getActionIconSource(type)} style={[
     size === 'medium' && {...Forms.smallIcon},
     size === 'small' && {...Forms.xSmallIcon},
    ]} />
  </TouchableOpacity>
)

export const CloseButton: FC<BaseButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    width: 60,
    height: 60,
  }}>
    <Image source={getActionIconSource('close')} style={{
      width: 40,
      height: 40,
      margin: 10
    }} />
  </TouchableOpacity>
)

export const MainButton: FC<BaseButtonProps> = ({ onPress, title, top, bottom, bgColor, color, size }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'smallRound' ? { ...Buttons.xSmallRoundButton } :
    size === 'small' ? { ...Buttons.xSmallSquareButton } : 
    size === 'large' ? { ...Buttons.longSquareSolid } : { ...Buttons.smallRoundedSolid },
    { backgroundColor: bgColor ?? Colors.pink.reg },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={[
      { ...Buttons.buttonText }, 
      color && { color: color},
      size === 'small' && { fontSize: 15 },
      size === 'large' && { fontSize: 20 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const TransparentButton: FC<BaseButtonProps> = ({ title, onPress, size, top, bottom, color, bgColor }) => (
  <TouchableOpacity onPress={onPress} style={[
    { borderColor: color ?? Colors.transparent.dark, backgroundColor: bgColor ?? Colors.transparent.light },
    size === 'small' ? { ...Buttons.xSmallRoundedTransparent }
    : size === 'large' ? { ...Buttons.longRoundedTransparent } : { ...Buttons.smallRoundedTransparent },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={[
      { ...Buttons.buttonText, color: color ?? Colors.transparent.dark },
      size === 'small' && { fontSize: 15 },
      size === 'large' && { fontSize: 20 },
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

interface GoBackButtonProps extends BaseButtonProps {
  position: string
  top: number
}

export const GoBackButton: FC<GoBackButtonProps> = ({ onPress, top, position }) => (
  <TouchableOpacity onPress={onPress} style={[
    position === 'topLeft' && top && { position: 'absolute', top: top, left: 15,
  }]}>     
    <Image source={getActionIconSource('undo')} style={{
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

export const CheckboxButton: FC<CheckboxButtonProps> = ({ onPress, size, initial }) => {
  const [check, setCheck] = useState<boolean>(initial)

  const handlePress = () => {
    setCheck(!check)
    onPress()
  }

  return (  
    <TouchableOpacity onPress={handlePress} style={{
      width: 20,
      height: 20,
      borderWidth: 1,
      ...Spacing.centered,
      marginHorizontal: 10
    }}>
      <Text style={{ fontSize: size === 'small' ? 10 : 15 }}>
        {check ? '✓' : ''}
      </Text>
    </TouchableOpacity>
  )
}