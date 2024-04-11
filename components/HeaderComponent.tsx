import { Image, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, Forms } from "@styles/index"
import { FC } from "react"
import { getActionIconSource } from "@utils/ui"

type BoxHeaderProps = {
  title: string
  onPress?: () => void
  titleColor?: string
  arrow?: string
  mode?: 'light'
}

interface BoxProps extends BoxHeaderProps {
  content: any
}

export const BoxHeader: FC<BoxHeaderProps> = ({ title, onPress, titleColor, arrow, mode }) => (
  <Pressable style={{
    ...Spacing.flexRow,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    width: '100%',
    paddingVertical: 10,
  }}
    onPress={onPress}
  >
    <Text style={[
      { ...Typography.xSmallHeader, margin: 0, marginLeft: 2, textAlign: 'left', }, 
    titleColor && { color: titleColor },
    mode === 'light' && { fontWeight: 'normal' },
    ]}>
      { title }
    </Text>
    <Image source={arrow === 'down' ? getActionIconSource('down') : getActionIconSource('next')} style={{
      ...Forms.xSmallIcon,
      marginLeft: 'auto',
    }} />
  </Pressable>
)

export const BoxWithHeader: FC<BoxProps> = ({ title, onPress, content, titleColor, arrow }) => (
  <View style={{
    ...Forms.roundedCon,
  }}>
    <BoxHeader title={title} onPress={onPress} titleColor={titleColor} arrow={arrow} />
    <View style={{
      width: '100%', alignItems: 'center'
    }}>
      { content }
    </View>
  </View>
)