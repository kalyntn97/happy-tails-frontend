//npm
import { useEffect, useRef } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { SharedValue, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
//styles
import { Spacing, Typography } from '@styles/index'

type ScrollSelectorProps = {
  data: any[]
  onSelect: (selected: any) => void
  initial?: number
  leftLabel?: string
  rightLabel?: string
  height?: number
  loop?: boolean
}

type RowProps = {
  item: any
  index: number
  height: number
  scrollY: SharedValue<number>
}


const Row = ({ item, index, height, scrollY }: RowProps) => {
  const animatedView = useAnimatedStyle(() => {

    return {
      transform: [
        { translateY: interpolate(
          scrollY.value,
          [(index - 1) * height, index * height, (index + 1) * height],
          [-height * 0.2, 0, height * 0.2],
          'clamp'
        )},
        { scale: interpolate(
          scrollY.value,
          [(index - 1) * height, index * height, (index + 1) * height],
          [1, 1.3, 1],
          'clamp'
        )},
      ],
      opacity: interpolate(
        scrollY.value,
        [(index - 1) * height, index * height, (index + 1) * height],
        [0.3, 1, 0.3],
        'clamp'
      ),
    }
  })

  return (  
    <Animated.View style={animatedView}>
      <Text style={styles.itemText}>{item}</Text>
    </Animated.View>
  )
}

const ScrollSelector = ({ data, onSelect, initial = 0, leftLabel, rightLabel, height = 50, loop = false }: ScrollSelectorProps) => {
  let selected: number
  const initialDataLength = data.length

  if (loop) data = [...data, ...data, ...data]

  const scrollY = useSharedValue(0)
  const ScrollViewRef = useRef(null)

  const onScrollHandler = useAnimatedScrollHandler((event) => {
    const offset = event.contentOffset.y
    scrollY.value = offset
  })

  const onScrollEnd = () => {
    selected = Math.round(scrollY.value / height ) 
    if (loop) selected = selected % initialDataLength
    onSelect(data[selected])
  }

  const initialScroll = () => {
    if (ScrollViewRef.current) {
      let position = initial * height
      if (loop) position += initialDataLength * height
      ScrollViewRef.current.scrollTo({ y: position, animated: true })
    }
  }

  useEffect(() => {
    initialScroll()
  }, [initial])

  return (
    <View style={[styles.carousel, { height: height * 3 }]}>
      {leftLabel && <Text style={styles.label}>{leftLabel}</Text> }
      <Animated.ScrollView
        ref={ScrollViewRef}
        snapToInterval={height}
        snapToAlignment={'center'}
        disableScrollViewPanResponder={true}
        decelerationRate="fast"
        contentContainerStyle={{ height: height * (data.length + 2), marginTop: height }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={data.length > 1}
        onScroll={onScrollHandler}
        scrollEventThrottle={50}
        onMomentumScrollEnd={onScrollEnd}
        onContentSizeChange={initialScroll}
        pinchGestureEnabled={false}
        directionalLockEnabled={true}
      >
        {data.map((item: any, index: number) =>
          <Pressable key={index} style={[styles.itemCon, { height: height }]}>
            <Row item={item} index={index} height={height} scrollY={scrollY} />
          </Pressable>
        )}
      </Animated.ScrollView>
      { rightLabel && <Text style={styles.label}>{rightLabel}</Text> }
    </View>
  )
}

const styles = StyleSheet.create({
  carousel: {
    ...Spacing.flexRow,
    flex: 1,
    marginHorizontal: 10,
  },
  itemCon: {
    ...Spacing.centered,
    paddingHorizontal: 15,
  },
  itemText: {
    fontSize: 18,
  },
  label: {
    ...Typography.largeBody,
    letterSpacing: 1,
    margin: 0,
    marginHorizontal: 30,
  }
})

export default ScrollSelector