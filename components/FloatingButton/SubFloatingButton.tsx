// npm
import { useEffect, useState } from "react"
import { Text, View, StyleSheet, DeviceEventEmitter, useWindowDimensions, Image, ImageStyle } from "react-native"
import { State, TapGestureHandler } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"
// styles
import { ButtonStyles, Button, subBtn_tap_event } from "./constants"
import { Spacing, Colors, Forms } from "@styles/index"
import { getIconSource } from "@utils/ui"


const SubFloatingButton = ({ onPress, label, index, x }) => {
  const { width } = useWindowDimensions()
 
  const iconSource = getIconSource(label)

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
      <Animated.View style={[
        styles.button, 
        { backgroundColor: Colors.multiArray2[index] }, 
        animatedStyles
      ]}>
        <Image style={styles.icon as ImageStyle} source={iconSource} />
        <Text style={styles.plus}>+</Text>
        <Text style={[
          styles.label,
          x > -width / 2 
          ? { right: ButtonStyles.width + 10, textAlign: 'right' } 
          : { left: ButtonStyles.width + 10, textAlign: 'left' }
        ]}>
          {label}
        </Text>
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
    fontSize: 25,
    position: 'absolute',
    top: 5,
    right: 10,
  },
  label: {
    width: ButtonStyles.width * 2,
    position: 'absolute',
    right: ButtonStyles.width + 10,
    fontWeight: 'bold',
    color: Colors.darkestPink,
    fontSize: 15,
  },
  icon: {
   ...Forms.smallIcon,
   position: 'absolute',
   bottom: 10,
   left: 10
  }
})

export default SubFloatingButton