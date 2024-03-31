import { Image, Pressable, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Spacing, Colors, Typography, Forms } from "@styles/index"
import { FC } from "react"

export const BoxStyles: ViewStyle = {
  width: '90%',
  backgroundColor: Colors.white,
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingTop: 10,
  paddingBottom: 20,
  // paddingVertical: 10,
  marginVertical: 10,
}

export const BoxHeader: FC<{ title: string, onPress: () => void }> = ({ title, onPress }) => (
  <Pressable style={{
    ...Spacing.flexRow,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    width: '100%',
    paddingVertical: 10,
  }}
    onPress={onPress}
  >
    <Text style={{
      ...Typography.xSmallHeader,
      margin: 0,
      textAlign: 'left',
    }}>
      { title }
    </Text>
    <Image source={require('@assets/icons/next3.png')} style={{
      ...Forms.xSmallIcon,
      marginLeft: 'auto',
    }} />
  </Pressable>
)

export const BoxWithHeader = ({ title, onPress, content }) => (
  <View style={{
    ...BoxStyles,
  }}>
    <BoxHeader title={title} onPress={onPress} />
    { content }
  </View>
)