import { useEffect, useRef } from "react"
import { Image, StyleSheet, View } from "react-native"
import { Forms } from "@styles/index"
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated"

const Loader = () => {
  const initialX = 30
  const initialFade = 1
  const duration = 500

  const PawPrint = ({ initialY, left }) => {
    const fade = useSharedValue(initialFade)
    const x = useSharedValue(initialX)
    const y = useSharedValue(initialY)
    const animatedPaw = useAnimatedStyle(() => ({
      transform: [{ translateX: x.value }, { translateY: y.value }],
      opacity: fade.value
    }))

    useEffect(() => {
      x.value = withRepeat(
        withSequence(
          withTiming(-initialX * 2, { duration, easing: Easing.cubic }),
          withTiming(-initialX, { duration, easing: Easing.cubic }),
          withTiming(0, { duration, easing: Easing.cubic }),
          withTiming(initialX, { duration, easing: Easing.cubic }),
          withTiming(initialX * 2, { duration, easing: Easing.cubic })
        ),
        -1,
        true
      )
      y.value = withRepeat(
        withSequence(
          withTiming(0, { duration, easing: Easing.cubic }),
          withTiming(initialY, { duration, easing: Easing.cubic }),
        ),
        -1,
        true
      )
      fade.value = withRepeat(
        withSequence(
          withTiming(initialFade, { duration: 2490, easing: Easing.cubic}),
          withTiming(0, { duration: 10, easing: Easing.cubic }),
        ),
        -1,
        true
      )
    }, [])

    return (
      <Animated.View style={[styles.paw, animatedPaw, { marginLeft: left } ]}>
        <Image source={require('@assets/icons/paw-print.png')} style={{ ...Forms.smallIcon, transform: [{ 'rotate': '90deg' }] }} />
      </Animated.View>
    )
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.pair}>
        <PawPrint initialY={30} left={30}/>
        <PawPrint initialY={-30} left={0}/>
      </View>
      <View style={[styles.pair, { right: 10 }]}>
        <PawPrint initialY={30} left={30}/>
        <PawPrint initialY={-30} left={0}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  paw: {
    
  },
  pair: {
    position: 'absolute'
  }
})

export default Loader