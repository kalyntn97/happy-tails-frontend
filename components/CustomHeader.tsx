import { Text, View } from "react-native"
import { GoBackButton } from "./ButtonComponent"

export const HeaderWithGoBackButton = ({ title, onPress}) => (
  <View style={{
    width: '100%',
    position: 'relative',
  }}>
    <GoBackButton onPress={onPress} top={10} />
    <Text>{title}</Text>
  </View>
)