// npm
import { Text, View, StyleSheet, DeviceEventEmitter } from "react-native"
import { State, TapGestureHandler } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
// styles
import { ButtonStyles, Button, subBtn_tap_event } from "./constants"
import { Spacing, Colors } from "../../styles"

const SubFloatingButton = ({ onPress, label, index}) => {
  const buttonOpacity = useSharedValue(1)
  
  const _onTapHandlerStateChange = ({ nativeEvent }) => {
    switch (nativeEvent.state) {
      case State.BEGAN: buttonOpacity.value = 0.5; break
      case State.END: {
        DeviceEventEmitter.emit(subBtn_tap_event)
        buttonOpacity.value = 1.0
        onPress && onPress()
        break
      }
      case State.CANCELLED: buttonOpacity.value = 1.0; break
      case State.FAILED: buttonOpacity.value = 1.0; break
      case State.UNDETERMINED: buttonOpacity.value = 1.0; break
    }
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value
    }
  })

  return (
    <TapGestureHandler onHandlerStateChange={_onTapHandlerStateChange}>
      <Animated.View style={[styles.button, { backgroundColor: Colors.multiArray2[index] },animatedStyles]}>
        <Text style={styles.plus}>+</Text>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </TapGestureHandler>
  )
}

const styles = StyleSheet.create({
  button: {
    ...Button,
    marginTop: 10,
  },
  plus: {
    color: ButtonStyles.textColor,
    fontSize: 30,
  },
  label: {
    width: ButtonStyles.width * 2,
    position: 'absolute',
    right: ButtonStyles.width + 10,
    fontWeight: 'bold',
    textAlign: 'right',
    color: Colors.darkPink,
    fontSize: 15,
  }
})

export default SubFloatingButton