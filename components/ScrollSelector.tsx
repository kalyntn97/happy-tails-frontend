//npm
import { useEffect, useRef, useState } from "react"
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface DateTimeProps {
  initials: { month: number, year: number }
}

const Row = ({ item, index, height, scrollY }) => {

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
    <Animated.View style={[styles.itemCon, animatedView]} key={index}>
      <Text style={styles.itemText}>{item}</Text>
    </Animated.View>
  )
}

const ScrollSelector = ({ data, onSelect, initialPos }) => {
  let selected: number

  const height = 50
  const scrollY = useSharedValue(0)
  const FlatListRef = useRef(null)

  const onScrollHandler = useAnimatedScrollHandler((event) => {
    const offset = event.contentOffset.y
    scrollY.value = offset
  })

  const onScrollEnd = () => {
    selected = (Math.round(scrollY.value / height))
    onSelect(selected)
  }

  return (
    <View style={styles.carousel}>

      <Animated.FlatList
        ref={FlatListRef}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <Pressable>
              <Row key={index} item={item} index={index} height={height} scrollY={scrollY}/>
            </Pressable>
          )
        }}
        getItemLayout={(data, index) => (
          {length: 50, offset: 50 * index, index}
        )}
        snapToInterval={height}
        snapToAlignment={'center'}
        disableScrollViewPanResponder={true}
        decelerationRate="fast"
        contentContainerStyle={{ height: 700, marginTop: height }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={data.length > 1}
        onScroll={onScrollHandler}
        onMomentumScrollEnd={onScrollEnd}
        initialScrollIndex={initialPos}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  carousel: {
    width: 130,
    height: 150,
  },
  itemCon: {
    width: '100%',
    height: 50,
    ...Spacing.centered,
  },
  itemText: {
    fontSize: 18,
  },
})

export default ScrollSelector