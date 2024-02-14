import { Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Buttons, Colors, Spacing } from "."

export const AddButton = ({ onPress }) => {
  return ( 
    <TouchableOpacity
      onPress={onPress}
      style={{
      ...Buttons.main,
      width: 60,
      height: 60,
      borderRadius: '50%',
      backgroundColor: Colors.pink,
      ...Spacing.centered,
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 2,
    }}>
      <Text style={{
        color: Colors.white,
        fontSize: 30,
        fontWeight: 'bold'
      }}>
        +
      </Text>
    </TouchableOpacity>
  )
}


