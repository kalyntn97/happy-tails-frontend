import { Image, ImageSourcePropType, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing, Forms, Typography } from "@styles/index"
import { FC } from "react"
import { transparent } from "@styles/buttons"

const whiteBtnTextStyles: TextStyle = {
  color: Colors.white,
  fontWeight: 'bold'
}

const smallIconButtonStyles: ViewStyle = {
  marginHorizontal: 5,
}

type BaseButtonProps = {
  title?: string
  onPress?: () => void
  top?: number
  bottom?: number
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
    position === 'bottomRight' && { position: 'absolute', bottom: 20, right: 20, zIndex: 2, }
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

const iconButtonSource = {
  'save': require('@assets/icons/save.png'),
  'delete': require('@assets/icons/delete.png'),
  'undo': require('@assets/icons/undo.png'),
  'edit': require('@assets/icons/edit.png'),
  'details': require('@assets/icons/details.png'),
}
const iconButtonStyles = {
  'edit': { bgColor: Colors.yellowArray[2] },
  'delete': { bgColor: Colors.redArray[1] },
  'details': { bgColor: Colors.greenArray[2] },
}

export const IconButton: FC<IconButtonProps> = ({ onPress, type, size }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' && {...smallIconButtonStyles as ViewStyle},
    size === 'medium' && { 
      width: 40, height: 60, borderRadius: 10, marginHorizontal: 2,
      backgroundColor: iconButtonStyles[type].bgColor, ...Spacing.centered,
    }
  ]}>
    <Image source={iconButtonSource[type]} style={[
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
    <Image source={require('@assets/icons/close.png')} style={{
      width: 40,
      height: 40,
      margin: 10
    }} />
  </TouchableOpacity>
)

export const MainButton: FC<BaseButtonProps> = ({ onPress, title, top, bottom, bgColor, color, size }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' ? { ...Buttons.xSmallSquareButton } : { ...Buttons.smallRoundedSolid },
    { backgroundColor: bgColor ?? Colors.pink },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={[
      { ...Buttons.buttonText }, 
      color && { color: color},
      size === 'small' && { fontSize: 15 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const TransparentButton: FC<BaseButtonProps> = ({ title, onPress, size, top, bottom, color }) => (
  <TouchableOpacity onPress={onPress} style={[
    size === 'small' ? { ...Buttons.xSmallRoundedTransparent } : { ...Buttons.smallRoundedTransparent },
    { borderColor: color ?? Colors.shadow },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={[
      { ...Buttons.buttonText, color: color ?? Colors.shadow },
      size === 'small' && { fontSize: 15 },
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const SubButton: FC<BaseButtonProps> = ({ onPress, title, top, bottom, size }) => (
  <TouchableOpacity onPress={onPress} style={[
    { ...Buttons.smallSubButton },
    top && { marginTop: top },
    bottom && { marginBottom: bottom },
  ]}>
    <Text style={{
      ...Buttons.buttonText,
      color: Colors.darkestPink
    }}>
      {title}
    </Text>
  </TouchableOpacity>
)

export const GoBackButton: FC<BaseButtonProps> = ({ onPress, top }) => (
  <TouchableOpacity onPress={onPress} style={{
    position: 'absolute',
    top: top,
    left: 15,
  }}>     
    <Image source={require('@assets/icons/undo.png')} style={{
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
      }, { color: item.stat === 0 ? Colors.red : color ? color : 'black' }
      ]}>
        {item.stat >= 0 && item.stat !== Infinity ? item.stat : '?'}
      </Text> 
    }
    
    {item.iconUri && 
      <Image source={item.iconUri as ImageSourcePropType} style={{
        ...Forms.smallIcon,
        margin: 0,
      }}/>
    }
    <Text style={{
      ...Typography.xSmallBody,
    }}>
      {item.body}
    </Text>
  </Pressable>
)