// npm
import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, useWindowDimensions, DeviceEventEmitter, Alert, TouchableWithoutFeedback } from "react-native"
import { PanGestureHandler, State, TapGestureHandler } from "react-native-gesture-handler"
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
// styles
import { Colors, Buttons, Spacing } from "../../styles"
import { Button, ButtonStyles, Animation, ChildrenAnimation } from "./constants"
import SubFloatingButton from "./SubFloatingButton"

const FloatingButton = ({ navigation }) => {
  const [opened, setOpened] = useState(false)

  const { width, height } = useWindowDimensions()
  const snapThreshold = ButtonStyles.width + ButtonStyles.margin * 2

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
    const children_position_Y_open = positionY.value > -height / 2 ? 1 : (ButtonStyles.width * 4 + 40)
    setOpened(true)
    childrenOpacity.value = withTiming(Animation.children_opacity_open, { duration: 300})
    childrenYPosition.value = withTiming(children_position_Y_open, { duration: 200})
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
  // tap animation 
  const _onTapHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      opened ? _close() : _open()
    }
  }

  //calculate the distances to corners

  // drag animation
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
      if (positionX.value > -width / 2 + snapThreshold) {
        positionX.value = withSpring(Animation.starting_position)
      } else if (positionX.value < -width + snapThreshold) {
        positionX.value = withSpring(-width + snapThreshold)
      }
      if (positionY.value > -height / 4 + snapThreshold) {
        positionY.value = withSpring(Animation.starting_position)
      } else if (positionY.value < -height + snapThreshold + 150) {
        positionY.value = withSpring(-height + snapThreshold + 150)
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
  }, [positionX.value])

  return (
    <>
      {opened && 
        <TouchableWithoutFeedback  onPress={() => _close()}>
          <View style={[styles.overlay, { width: width, height: height}]} />
        </TouchableWithoutFeedback> 
      }
      <PanGestureHandler onHandlerStateChange={_onPanHandlerStateChange}>
        <Animated.View style={[styles.buttonContainer, { bottom: height * 0.3 }, animatedRootStyles]}>
          {opened &&
            <Animated.View style={[styles.children, animatedChildrenStyles]}>
              <SubFloatingButton label='Add a Pet' index={2} x={positionX.value} 
                onPress={() => navigation.navigate('Pets', { screen: 'Create' })} 
              />
              <SubFloatingButton label='Add a Vet Visit' index={1} x={positionX.value} 
                onPress={() => Alert.alert('Pressed 2!')} 
              />
              <SubFloatingButton label='Add a Task' index={0} x={positionX.value} 
                onPress={() => navigation.navigate('Care', { screen: 'Create' })} 
              />
            </Animated.View>
          }
          <TapGestureHandler onHandlerStateChange={_onTapHandlerStateChange}>
            <Animated.View style={[styles.button, animatedBtnStyles]}>
              <Animated.Text style={[styles.text, animatedText]}>+</Animated.Text>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </>
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
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
  }
})

export default FloatingButton