//npm
import { useLayoutEffect, useRef, useState, useEffect } from "react"
import { Image, ImageStyle, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//services & utils
import { Tracker } from "../services/careService"
import { getCurrentDate, getDaysOfWeek } from "../utils/careUtils"
//components
import ScrollCalendar from "./ScrollCalendar"
import ProgressTracker from "./ProgressTracker"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CurrentTrackerProps {
  tracker: Tracker
  freq: string
  times: number
}

const TrackerPanel = ({ tracker, freq, times }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {freq === 'daily' ? 'Today' : freq === 'weekly' ? 'This week' : freq === 'monthly' ? 'This month' : 'This year'}
      </Text> 
      {freq === 'daily' && times === 1 
      ? <>
        <Text style={styles.msg}>
          {tracker.done[tracker.done.length - 1] === 1 ? 'You did it!' : 'Mark as done?'}
        </Text>
        <View style={styles.scrollCalendar}>
          <ScrollCalendar tracker={tracker} />
        </View>
      </>
      : <>
        <Text style={styles.msg}>
          {times === tracker.done[tracker.done.length - 1] ? 'Keep up the good work!' : `Only ${freq === 'yearly' ? times - tracker.done.length : times - tracker.done[tracker.done.length - 1]} more to go!`}
        </Text>
        
        <View style={styles.countBox}>
          <Text style={[
              styles.status, 
              {color: 
                times === 
                  (freq === 'yearly' ? tracker.done.length : tracker.done[tracker.done.length - 1]) 
                ? Colors.green 
                : Colors.red 
            }]}>
            {times === tracker.done[tracker.done.length - 1] ? 'You did it!' : 'Mark as Done?'}
          </Text>

          <View style={styles.countContent}>
            <Text style={[styles.count, { color: Colors.green }]}>{freq === 'yearly' ? tracker.done.length : tracker.done[tracker.done.length - 1]}</Text>

            <TouchableOpacity style={styles.heartBtn}>
              <ProgressTracker done={freq === 'yearly' ? tracker.done.length : tracker.done[tracker.done.length - 1]} times={times} />
              {/* {times > tracker.done[tracker.done.length - 1] && 
                <>
                  { !isChecked && <Image source={require('../assets/icons/heart-gray.png')} style={styles.heart as ImageStyle} /> }
                  { isChecked && <Image source={require('../assets/icons/heart-filled.png')} style={styles.heart as ImageStyle} /> }
                </>
              } */}
            </TouchableOpacity>

            <Text style={[styles.count, { color: Colors.red }]}>{freq === 'yearly' ? times - tracker.done.length : times - tracker.done[tracker.done.length - 1]}</Text>
          </View>
        </View>
      </>
      }
     
     
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  progress: {
    ...Spacing.flexRow
  },
  tracker: {
  },
  countBox: {
    ...Spacing.flexColumn,
    margin: 10
  },
  msg: {
    margin: 10
  },
  count: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5,
  },
  countContent: {
    ...Spacing.flexRow,
    alignItems: 'center'
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  heartBtn: {
    ...Spacing.flexRow,
  },
  heart: {
    width: 40,
    height: 40,
    marginHorizontal: 2,
  },  
  title: {
    ...Typography.smallHeader,
    margin: 5,
    color: Colors.darkPink
  },
  dateContainer: {
    width: 50,
    height: 60,
    backgroundColor: Colors.lightestPink,
    borderRadius: 8,
    justifyContent: 'space-around'
  },
  date: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  scrollCalendar: {
    width: 275,
    height: '50%',
    borderRadius: 8
  },
})

export default TrackerPanel