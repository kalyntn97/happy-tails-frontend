import { ActivityIndicator, Image, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, Forms } from "@styles/index"
import { FC } from "react"
import { getActionIconSource } from "@utils/ui"
import { ImageSourcePropType } from "react-native"
import { ToastConfigParams } from "react-native-toast-message"

type BoxHeaderProps = {
  title: string
  titleIconSource?: ImageSourcePropType
  onPress?: () => void
  titleColor?: string
  arrow?: string
  mode?: 'light' | 'dark'
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
  <View style={{ ...Forms.roundedCon }}>
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
  <View style={[top && { marginTop: top }, { ...Spacing.fullWH, ...Spacing.centered }]}>
    <Image source={require('assets/images/error.png')} style={{ maxWidth: 300, resizeMode: 'contain' }} />
  </View>
)

export const CatToast = ({ text1, text2, props }) => (
  <View style={{ ...Spacing.flexRow, backgroundColor: Colors.white, borderRadius: 6, paddingHorizontal: 15, paddingVertical: 10, width: '90%', height: 70, ...Forms.boxShadow, shadowColor: props.style === 'success' ? Colors.green.dark : Colors.red.dark, ...Forms.boxShadow }}>
    <Image source={props.style === 'success' ? require('assets/icons/ui-cat-happy.png') : require('assets/icons/ui-cat-sad.png')} style={{ ...Forms.icon}} />
    <View style={{ ...Spacing.flexColumn, marginLeft: 10, alignItems: 'flex-start' }}>  
      <Text style={{ textTransform: 'capitalize', fontWeight: 'bold', fontSize: 15, marginBottom: 5 }}>{props.style}!</Text>
      <Text>{text1}</Text>
      { text2 && <Text>{text2}</Text> }
    </View>
    <Pressable style={{ marginLeft: 'auto' }} onPress={props.onClose}>
      <Image source={getActionIconSource('close')} style={{ ...Forms.smallIcon}} />
    </Pressable>
  </View>
)

export const toastConfig = {
  catToast: ({ text1, text2, props }: ToastConfigParams<any>) => ( <CatToast text1={text1} text2={text2} props={props} /> )
}

export const EmptyList = ({ type }: { type: string }) => (
  <Text style={type === 'task' ? { ...Typography.smallSubHeader } : { ...Typography.xSmallSubHeader }}>No {type}s added.</Text>
) 

export const TopRightHeader = ({ onPress }) => (
  <Pressable onPress={onPress} style={{
    ...Spacing.flexRow, position: 'absolute', right: -5, top: 0,
  }}>
    <Text style={{ ...Typography.xSmallHeader, marginRight: 10 }}>Add</Text>
    <Image source={getActionIconSource('add')} style={{ ... Forms.xSmallIcon }} />
  </Pressable>
)
