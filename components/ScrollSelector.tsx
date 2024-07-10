//npm
import { Children, useEffect, useRef, useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { SharedValue, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'

type ScrollSelectorProps = {
  data: any[]
  onSelect: (selected: any) => void
  initial?: number
  leftLabel?: string
  rightLabel?: string
}

type RowProps = {
  item: any
  index: number
  height: number
  scrollY: SharedValue<number>
}

const height = 50

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
    <Animated.View style={[styles.itemCon, animatedView]}>
      <Text style={styles.itemText}>{item}</Text>
    </Animated.View>
  )
}

const ScrollSelector = ({ data, onSelect, initial, leftLabel, rightLabel }: ScrollSelectorProps) => {
  let selected: number

  const scrollY = useSharedValue(0)
  const ScrollViewRef = useRef(null)

  const onScrollHandler = useAnimatedScrollHandler((event) => {
    const offset = event.contentOffset.y
    scrollY.value = offset
  })

  const onScrollEnd = () => {
    selected = (Math.round(scrollY.value / height))
    onSelect(selected)
  }

  const initialScroll = () => {
    if (ScrollViewRef.current && initial) {
      ScrollViewRef.current.scrollTo({ y: initial * height, animated: true })
    }
  }

  return (
    <View style={styles.carousel}>
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
          <Pressable key={index} style={styles.itemCon}>
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
    height: height * 3,
    marginHorizontal: 10,
  },
  itemCon: {
    ...Spacing.centered,
    height: height,
  },
  itemText: {
    fontSize: 18,
  },
  label: {
    ...Typography.regBody,
    letterSpacing: 1,
    margin: 0,
    marginHorizontal: 30,
  }
})

export default ScrollSelector