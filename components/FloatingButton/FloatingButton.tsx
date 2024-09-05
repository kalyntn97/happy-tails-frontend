// npm
import React, { useEffect, useState } from "react"
import { DeviceEventEmitter, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import SubFloatingButton from "./SubFloatingButton"
// styles & constants
import { Animation, Button, ButtonStyles, ChildrenAnimation, snapThreshold } from "./constants"

const subButtons = [
  { key: 'pets', label: 'Add a Pet', index: 2, onPress: (navigation) => navigation.navigate('PetCreate') },
  { key: 'vet', label: 'Add a Vet Visit', index: 1, onPress: (navigation) => navigation.navigate('HealthCreate') },
  { key: 'task', label: 'Add a Task', index: 0, onPress: (navigation) => navigation.navigate('CareCreate') },
]

const FloatingButton = ({ navigation }) => {
  const [opened, setOpened] = useState(false)

  const { width, height } = useWindowDimensions()

  const subBtn_tap_event = 'subBtn_tap_event'
  // initial position
  const positionX = useSharedValue(0)
  const positionY = useSharedValue(0)
  const prevPositionX = useSharedValue(0)
  const prevPositionY = useSharedValue(0)
  // plus sign of button
  const rotation = useSharedValue(ChildrenAnimation.rotation_close)
  const plusTranslateY = useSharedValue(ChildrenAnimation.plus_translate_y_close)
  // children
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
  const tap = Gesture.Tap()
    .onEnd(e => {
      opened ? runOnJS(_close)() : runOnJS(_open)() 
    })
  // drag animation
  const pan = Gesture.Pan()
    .onStart(() => { 
      prevPositionX.value = positionX.value
      prevPositionY.value = positionY.value
    })
    .onUpdate(e => {
      positionX.value = e.translationX + prevPositionX.value
      positionY.value = e.translationY + prevPositionY.value
    })
    .onEnd(e => {
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
    })
 
  const animatedRootStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionX.value }, { translateY: positionY.value }]
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
      <GestureDetector gesture={Gesture.Simultaneous(pan, tap)}>
        <Animated.View style={[styles.buttonContainer, animatedRootStyles]}>
          
          {opened &&
            <Animated.View style={[styles.children, animatedChildrenStyles]}>
              {subButtons.map(subButton => 
                <SubFloatingButton key={subButton.key} label={subButton.label} index={subButton.index} x={positionX.value} onPress={subButton.onPress} navigation={navigation} />
              )}
            </Animated.View>
          }
          <Animated.View style={[styles.button, animatedBtnStyles]}>
            <Animated.Text style={[styles.text, animatedText]}>+</Animated.Text>
          </Animated.View>

        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: ButtonStyles.margin,
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