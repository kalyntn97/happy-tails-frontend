//npm
import { useRef, useState, useEffect } from "react"
import { ScrollView, StyleSheet, Text, View, Image, ImageStyle, TouchableOpacity, Pressable } from "react-native"
//utils
import * as careHelpers from "@care/careHelpers"
import { getDateInfo, getMonth, getDayOfWeek } from "@utils/datetime"
//styles
import { getStatQualIconSource } from "@utils/ui"
import { Colors, UI, Spacing } from '@styles/index'

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

  const textStyle = (condition: boolean) => condition ? Colors.black : Colors.shadow.reg

  const Circle = ({ children, i }) => (
    <View style={[styles.circle, { backgroundColor: i + 1 === 1 ? Colors.transparent.light : Colors.white  }]}>{children}</View>
  )

  let wrapper = []
    for (let i = 0; i < containerNumber; i++) {
      const renderDaily = () => (
        <>
          <Text style={[styles.text, styles.topText, { color: textStyle(i + 1 === currDate) }]}>
            {getDayOfWeek(new Date(currYear, monthIdx - 1, i + 1)).slice(0, 3)}
          </Text>
          <Circle i={i} children={<Text style={[styles.text, { color: textStyle(i + 1 === currDate), fontSize: 20, zIndex: 2 }]}>{i + 1}</Text>} />
        </>
      )
      const renderWeekly = () => (
        <>
          <Text style={[styles.text, styles.topText, { color: textStyle(i + 1 === currDate) }]}>Week</Text>
          <Circle i={i} children={<Text style={[styles.text, { color: textStyle(i + 1 === currWeek) }]}>{i + 1}</Text> } />
        </>
      )
      const renderYearly = () => (
        <Circle i={i} children={<Text style={[styles.text, { color: textStyle(i + 1 === monthIdx) }]}>
          {getMonth(i + 1).slice(0, 3)}
        </Text>} />
      )

      wrapper.push(
        <TouchableOpacity
          style={styles.square} key={i}
          disabled={i + 1 !== currContainer}
          onPress={handleCheck}
        >
          { frequency === 'Daily' ? renderDaily()
          : frequency === 'Weekly' ? renderWeekly()
          : renderYearly()
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
  },
  square: {
    width: 55,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 3,
    borderColor: Colors.transparent.light,
    ...Spacing.flexColumn,
  },
  text: {
    fontWeight: 'bold'
  },
  topText: {
    
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 99,
    ...Spacing.centered,
  },
})

export default ScrollChart