import { useEffect, useRef, useState } from "react"
import { Image, StyleSheet, View, useWindowDimensions } from "react-native"
import { Colors, UI, Spacing } from "@styles/index"
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated"
import { windowWidth } from "@utils/constants"

const Loader = () => {
  const [start, setStart] = useState(true)
  const DELAY = 250
  const DURATION = 500
  const NUM_OP = 7
  const opacity = Array.from({length: NUM_OP }, () => useSharedValue(0))

  const animateDelayOpacity = (toValue: number) => {
    for (let i = 0; i < NUM_OP; i++) {
      opacity[i].value =  withDelay(DELAY * i, withTiming(toValue, { duration: DURATION }))
    }
    setTimeout(() => {
      setStart(!start)
    }, DELAY * NUM_OP)
  }

  useEffect(() => {
    const animate = () => {
      if (start) {
        animateDelayOpacity(1)
      } else {
        animateDelayOpacity(0)
      }
    }
    animate()
  }, [start])
  
  const container = []
  for (let i = 0; i < NUM_OP; i++) {
    container.push(
      <Animated.View key={i} style={[
        styles.paw, 
        { 
          left: i * 50, bottom: i % 2 === 0 ? 50 : 0,
          opacity: opacity[i]
        }
      ]}>
        <Image source={require('@assets/icons/pet-paw.png')} style={{ ...UI.icon(), transform: [{ 'rotate': '90deg' }] }} />
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ width: windowWidth * 0.9, height: 120 }}>
        { container }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.centered,
  },
  paw: {
    position: 'absolute',
  },
})

export default Loader