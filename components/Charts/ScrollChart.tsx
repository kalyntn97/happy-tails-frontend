//npm
import { useRef, useState, useEffect } from "react"
import { ScrollView, StyleSheet, Text, View, Image, ImageStyle, TouchableOpacity, Pressable } from "react-native"
//utils
import * as careHelpers from "@care/careHelpers"
import { getDateInfo, getMonth, getDayOfWeek } from "@utils/datetime"
//styles
import { getStatQualIconSource } from "@utils/ui"
import { Colors, Forms } from '@styles/index'

const ScrollChart = ({ careId, tracker, index, onCheckDone, onUncheckDone, frequency }) => {
  const { date: currDate, year: currYear, month: monthIdx, week: currWeek, daysInMonth, weeksInMonth } = getDateInfo('today')

  const handleCheck = async () => {
    tracker.done[index] === 1
      ? await onUncheckDone!(careId, tracker._id, index)
      : await onCheckDone!(careId, tracker._id, index)
  }

  const scrollViewRef = useRef(null)
  
  let containerNumber: number, currContainer: number

  switch (frequency) {
    case 'Daily':
      containerNumber = daysInMonth
      currContainer = currDate
      break
    case 'Weekly':
      containerNumber = weeksInMonth
      currContainer = currWeek
      break
    case 'Monthly':
      containerNumber = 12
      currContainer = monthIdx
      break
    default: 
      break
  }

  let wrapper = []
    for (let i = 0; i < containerNumber; i++) {
      wrapper.push(
        <TouchableOpacity
          style={styles.square} key={i}
          disabled={i + 1 !== currContainer}
          onPress={handleCheck}
        >
          {frequency === 'Daily' ?
            <>
              <Text style={[styles.text, { color: i + 1 === currDate ? Colors.pink.dark : 'black'}]}>
                {getDayOfWeek(new Date(currYear, monthIdx - 1, i + 1)).slice(0, 3)}
              </Text>
              <Text style={[styles.text, { color: i + 1 === currDate ? Colors.pink.darkest : 'black', fontSize: 20, zIndex: 2 }]}>{i + 1}</Text>
            </>
          : frequency === 'Weekly' ? 
            <Text style={[styles.text, styles.topText, { color: i + 1 === currWeek ? Colors.pink.dark : 'black' }]}>W{i + 1}</Text>
          : 
            <Text style={[styles.text, styles.topText, { color: i + 1 === monthIdx ? Colors.pink.dark : 'black'}]}>
              {getMonth(i + 1).slice(0, 3)}
            </Text>
          }

          {tracker.done[i] === 1
            ? <Image source={getStatQualIconSource('heart', 1)} 
                style={[styles.heart, { opacity: frequency === 'Daily' ? 0.5 : 1 }]} 
              />
            : <Image source={getStatQualIconSource('heart', 0)} style={styles.heart } />
          }
        </TouchableOpacity>
      )
    }

    const scrollToPos = () => {
      if (scrollViewRef.current) {
        const offset = (frequency === 'Daily' ? currDate : frequency === 'Weekly' ? currWeek : monthIdx) * 55 - 165 //daily-box width
        scrollViewRef.current.scrollTo({ x: offset, animated: true })
      }
    }

  return (
    <ScrollView 
      ref={scrollViewRef}
      horizontal
      style={styles.wrapper}
      onContentSizeChange={scrollToPos} // default position
      onMomentumScrollEnd={scrollToPos}
      scrollEventThrottle={200}
      decelerationRate="fast"
    >
      {wrapper}
    </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.transparent.dark,
    backgroundColor: Colors.transparent.light,
  },
  square: {
    width: 55,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRightWidth: 3,
    borderColor: Colors.transparent.semiLight,
  },
  text: {
    fontWeight: 'bold'
  },
  topText: {
    position: 'absolute',
    top: 5,
  },
  heart: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 0,
    left: 6
  },
})

export default ScrollChart