import { Image, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, Forms } from "@styles/index"
import { FC } from "react"
import { getActionIconSource } from "@utils/ui"

type BoxHeaderProps = {
  title: string
  onPress?: () => void
  titleColor?: string
}

interface BoxProps extends BoxHeaderProps {
  content: any
}

export const BoxHeader: FC<BoxHeaderProps> = ({ title, onPress, titleColor }) => (
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
      {
      ...Typography.xSmallHeader,
      margin: 0,
      marginLeft: 2,
      textAlign: 'left',
    }, titleColor && { color: titleColor }
    ]}>
      { title }
    </Text>
    <Image source={getActionIconSource('next')} style={{
      ...Forms.xSmallIcon,
      marginLeft: 'auto',
    }} />
  </Pressable>
)

export const BoxWithHeader: FC<BoxProps> = ({ title, onPress, content, titleColor }) => (
  <View style={{
    ...Forms.roundedCon,
  }}>
    <BoxHeader title={title} onPress={onPress} titleColor={titleColor} />
    <View style={{
      width: '100%', alignItems: 'center'
    }}>
      { content }
    </View>
  </View>
)