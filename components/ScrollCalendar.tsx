//npm
import { useRef, useState, useEffect } from "react"
import { ScrollView, StyleSheet, Text, View, Image, ImageStyle, TouchableOpacity, Pressable } from "react-native"
//utils
import * as careUtils from "../utils/careUtils"
import useCurrentDayInfo from "../utils/useCurrentDayInfo"
import { Tracker } from "../services/careService"
//styles
import { Colors, Forms } from '../styles'

const ScrollCalendar = ({ careId, tracker, index, onCheckDone, onUncheckDone, frequency }) => {
  const { currDate, currYear, monthIdx, currWeek, daysInMonth, weeksInMonth } = useCurrentDayInfo()

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
              <Text style={[styles.text, { color: i + 1 === currDate ? Colors.darkPink : 'black'}]}>
                {careUtils.getDayOfWeek(new Date(currYear, monthIdx - 1, i + 1)).slice(0, 3)}
              </Text>
              <Text style={[styles.text, { color: i + 1 === currDate ? Colors.darkestPink : 'black', fontSize: 20, zIndex: 2 }]}>{i + 1}</Text>
            </>
          : frequency === 'Weekly' ? 
            <Text style={[styles.text, styles.topText, { color: i + 1 === currWeek ? Colors.darkPink : 'black' }]}>W{i + 1}</Text>
          : 
            <Text style={[styles.text, styles.topText, { color: i + 1 === monthIdx ? Colors.darkPink : 'black'}]}>
              {careUtils.getMonth(i + 1).slice(0, 3)}
            </Text>
          }

          {i === index && tracker.done[index] === 1
            ? <Image source={require('../assets/icons/heart-filled.png')} 
                style={[styles.heart, { opacity: frequency === 'Daily' ? 0.5 : 1 }]} 
              />
            : <Image source={require('../assets/icons/heart-gray.png')} style={styles.heart } />
          }
        </TouchableOpacity>
      )
    }

    const scrollToToday = () => {
      if (scrollViewRef.current) {
        const offset = currDate * 55 - 165 //daily-box width
        scrollViewRef.current.scrollTo({ x: offset, animated: true })
      }
    }

  return (
    <ScrollView 
      ref={scrollViewRef}
      horizontal
      style={styles.wrapper}
      onContentSizeChange={scrollToToday} // default position
      onMomentumScrollEnd={scrollToToday}
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
    borderColor: Colors.pink,
    backgroundColor: Colors.lightestPink
  },
  square: {
    width: 55,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRightWidth: 3,
    borderColor: Colors.white
  },
  text: {
    fontWeight: 'bold'
  },
  topText: {
    position: 'absolute',
    top: 5,
  },
  heart: {
    width: 35,
    height: 35,
    position: 'absolute',
    bottom: 0,
    left: 8,
  },
})

export default ScrollCalendar