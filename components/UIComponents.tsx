import { Image, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, Forms } from "@styles/index"
import { FC } from "react"
import { getActionIconSource } from "@utils/ui"
import { ImageSourcePropType } from "react-native"
import ToastManager, { Toast } from "toastify-react-native"

type BoxHeaderProps = {
  title: string
  titleIconSource?: ImageSourcePropType
  onPress?: () => void
  titleColor?: string
  arrow?: string
  mode?: 'light'
  rightContent?: any
}

interface BoxProps extends BoxHeaderProps {
  content: any
}

export const BoxHeader: FC<BoxHeaderProps> = ({ title, onPress, titleColor, arrow, mode, titleIconSource, rightContent }) => (
  <Pressable style={{
    ...Spacing.flexRow,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    width: '100%',
    paddingVertical: 10,
  }}
    onPress={onPress}
  >
    { titleIconSource && <Image source={titleIconSource} style={{ ...Forms.smallIcon }} /> }
    <Text style={[
      { ...Typography.xSmallHeader, margin: 0, marginLeft: titleIconSource ? 7 : 2, textAlign: 'left', }, 
    titleColor && { color: titleColor },
    mode === 'light' && { fontWeight: 'normal' },
    ]}>
      { title }
    </Text>
    <View style={{ ...Spacing.flexRow, marginLeft: 'auto' }}>
      { rightContent && rightContent }
      <Image source={arrow === 'down' ? getActionIconSource('down') : getActionIconSource('next')} style={{ ...Forms.xSmallIcon, marginLeft: 10 }} />
    </View>
  </Pressable>
)

export const BoxWithHeader: FC<BoxProps> = ({ title, titleIconSource, onPress, content, titleColor, arrow }) => (
  <View style={{
    ...Forms.roundedCon,
  }}>
    <BoxHeader title={title} onPress={onPress} titleColor={titleColor} arrow={arrow} titleIconSource={titleIconSource}/>
    <View style={{
      width: '100%'
    }}>
      { content }
    </View>
  </View>
)

type CircleIconProps = {
  iconSource: ImageSourcePropType
  size?: string
  bgColor?: string
}

export const CircleIcon: FC<CircleIconProps> = ({ iconSource, size, bgColor }) => (
  <View style={{ backgroundColor: bgColor ?? Colors.shadow.light, ...Forms.roundedIconCon }}>
    <Image source={iconSource} style={{ ...Forms.largeIcon }} />
  </View>
)
 
export const ErrorMessage: FC<{ error: string, top?: number }> = ({ error, top }) => (
  <Text style={{ ...Typography.errorMsg, marginTop: top ?? 0 }}>{error}</Text>
)

export const ErrorImage: FC<{ top?: number }> = ({ top }) => (
  <View style={[top && { marginTop: top }, { width: '100%' }]}>
    <Image source={require('assets/images/error.png')} style={{ maxWidth: 300, resizeMode: 'contain' }} />
  </View>
)

  
