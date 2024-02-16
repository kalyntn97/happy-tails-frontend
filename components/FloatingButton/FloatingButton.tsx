// npm
import { useEffect, useState } from "react"
import { StyleSheet, View, Text, useWindowDimensions, DeviceEventEmitter } from "react-native"
import { PanGestureHandler, State, TapGestureHandler } from "react-native-gesture-handler"
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
// styles
import { Colors, Buttons, Spacing } from "../../styles"
import { Button, ButtonStyles, Animation, ChildrenAnimation } from "./constants"

const FloatingButton = ({ children }) => {
  const [opened, setOpened] = useState(false)
 
  const { width, height } = useWindowDimensions()
  const subBtn_tap_event = 'subBtn_tap_event'
  // initial position
  const positionX = useSharedValue(0)
  const positionY = useSharedValue(0)
  // plus sign of button
  const rotation = useSharedValue(ChildrenAnimation.rotation_close)
  const plusTranslateY = useSharedValue(ChildrenAnimation.plus_translate_y_close)

  const childrenYPosition = useSharedValue(ChildrenAnimation.children_position_y_close)
  const childrenOpacity = useSharedValue(ChildrenAnimation.children_opacity_close)

  const _open = () => {
    setOpened(true)
    childrenOpacity.value = withTiming(Animation.children_opacity_open, { duration: 300})
    childrenYPosition.value = withTiming(Animation.children_position_Y_open, { duration: 200})
    rotation.value = withSpring(Animation.rotation_open)
    plusTranslateY.value = withSpring(Animation.plus_translate_Y_open)
  }

  const _close = () => {
    childrenOpacity.value = withTiming(ChildrenAnimation.children_opacity_close, { duration: 300 })
    childrenYPosition.value = withTiming(ChildrenAnimation.children_position_y_close, { duration: 300 })
    rotation.value = withSpring(ChildrenAnimation.rotation_close)
    plusTranslateY.value = withSpring(ChildrenAnimation.plus_translate_y_close)
    setTimeout(() => {
      setOpened(false)
    }, 300)
  }

  const _onTapHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      opened ? _close() : _open()
    }
  }

  const _onPanHandlerStateChange = useAnimatedGestureHandler({
    onStart: (_, ctx: {startX: number, startY: number }) => {
      ctx.startX = positionX.value
      ctx.startY = positionY.value
    },
    onActive: (event, ctx) => {
      positionX.value = ctx.startX + event.translationX
      positionY.value = ctx.startY + event.translationY
    },
    onEnd: _ => {
      if (positionX.value > -width / 2) {
        positionX.value = withSpring(Animation.starting_position)
        positionY.value = withSpring(Animation.starting_position)
      } else {
        positionX.value = withSpring(-width + ButtonStyles.width + ButtonStyles.margin * 2)
        positionY.value = withSpring(Animation.starting_position)
      }
    }
  })

  const animatedRootStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ]
    }
  })

  const animatedChildrenStyles = useAnimatedStyle(() => {
    return {
      opacity: childrenOpacity.value,
      transform: [{ translateY: childrenYPosition.value }]
    }
  })

  const animatedBtnStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg`}]
    }
  })

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: plusTranslateY.value }]
    }
  })

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener(subBtn_tap_event, () => _close())
    return () => listener.remove()
  }, [])

  return (
    <PanGestureHandler onHandlerStateChange={_onPanHandlerStateChange}>
      <Animated.View style={[styles.buttonContainer, { bottom: height * 0.4 }, animatedRootStyles]}>
        {opened && 
          <Animated.View style={[styles.children, animatedChildrenStyles]}>{children}</Animated.View>
        }
      <TapGestureHandler onHandlerStateChange={_onTapHandlerStateChange}>
        <Animated.View style={[styles.button, animatedBtnStyles]}>
          <Animated.Text style={[styles.text, animatedText]}>+</Animated.Text>
        </Animated.View>
      </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    right: ButtonStyles.margin,
  },
  button: {
    ...Button,
  },
  text: {
    color: ButtonStyles.textColor,
    fontSize: 40,
  },
  children: {
    width: ButtonStyles.width,
    marginBottom: 10,
  }
})

export default FloatingButton