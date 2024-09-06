import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
//styles
import { Colors, Spacing } from '@styles/index'

type Props = {
  currIndex: number
  listLength: number
  color?: string
}

const Dot = ({ index, currIndex, listLength, bgColor }: { index: number, currIndex: number, listLength: number, bgColor: string }) => {
  const _currIndex = currIndex // === 0 ? 0 : currIndex === listLength ? 2 : 1
  const animatedDot = useAnimatedStyle(() => {
    const color = interpolate(
      _currIndex,
      [index - 1, index , index + 1],
      [0, 1, 0],
      'clamp'
    )
    const scale = interpolate(
      _currIndex,
      [index - 1, index , index + 1],
      [1, 1.3, 1],
      'clamp'
    )
    return {
      backgroundColor: color === 1 ? bgColor : Colors.shadow.dark,
      transform: [{ scale }],
    }    
  })
  
  return (
    <Animated.View style={[styles.dot, animatedDot, listLength > 3 && index === 1 && _currIndex > 1 && { width: 15 }]} />
  )
}

const DotNav = ({ currIndex, listLength, color = Colors.pink.reg }: Props) => {

  // const handleClickNext = () => {
  //   const nextCard = Math.min(currIndex + 1, petCount - 1)
  //   if (FlatListRef.current) {
  //     (FlatListRef.current as any).scrollToIndex({ index: nextCard })
  //   }
  // }
  // const handleClickPrev = () => {
  //   const prevCard = Math.max(currIndex - 1, 0)
  //   if (FlatListRef.current) {
  //     (FlatListRef.current as any).scrollToIndex({ index: prevCard })
  //   }
  // }

  return (
    // <View style={styles.rowCon}>
    //   <Pressable 
    //     onPress={handleClickPrev} 
    //     style={[styles.prevBtn, currIndex == 0 && styles.disabled, styles.baseNavBtn]}
    //     disabled={currIndex == 0}
    //   >
    //     <Icon name='prev' size='xSmall' /> 
    //   </Pressable>
      
      <View style={styles.dotNav}>
        { Array(listLength).fill(0).map((_, i) =>
          <Dot key={i} index={i} bgColor={color} currIndex={currIndex} listLength={listLength} />
        ) }
      </View>
      
    //   <Pressable 
    //     onPress={handleClickNext} 
    //     style={[styles.nextBtn, currIndex == petCount - 1  && styles.disabled, styles.baseNavBtn]}
    //     disabled={currIndex == petCount - 1}
    //   >
    //     <Icon name='next' size='xSmall' /> 
    //   </Pressable>
    // </View>
  )
}

const styles = StyleSheet.create({
  dotNav: {
    ...Spacing.flexRow,
    marginTop: 10,
    width: 120,
    justifyContent: 'space-between',
  },
  dot: {
    margin: 10,
    width: 8,
    height: 8,
    borderRadius: 99,
  },
})

export default DotNav
