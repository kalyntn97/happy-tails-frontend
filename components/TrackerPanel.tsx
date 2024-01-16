//npm
import { useLayoutEffect, useRef, useState, useEffect } from "react"
import { Image, ImageStyle, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//services & utils
import { Tracker } from "../services/careService"
import * as careService from '../services/careService'
import * as careUtils from "../utils/careUtils"
//components
import ScrollCalendar from "./ScrollCalendar"
import ProgressTracker from "./ProgressTracker"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CurrentTrackerProps {
  careId: string
  currTracker: Tracker
  freq: string
  times: number
  index: number
}

const TrackerPanel: React.FC<CurrentTrackerProps> = ({ careId, currTracker, freq, times, index }) => {
  const [tracker, setTracker] = useState<Tracker>(currTracker)
  
  const checkDone = async (careId: string, trackerId: string, index: number) => {
    try {
      console.log('before submit', careId, trackerId, index)
      const updatedTracker = await careService.checkDone(careId, trackerId, index)
      console.log('after submit', updatedTracker)
      setTracker(updatedTracker)
    } catch (error) {
      console.log('Error checking done', error)
    }
  }

  const uncheckDone = async (careId: string, trackerId: string, index: number) => {
    try {
      console.log('before submit', careId, trackerId, index)
      const updatedTracker = await careService.uncheckDone(careId, trackerId, index)
      console.log('after submit', updatedTracker)
      setTracker(updatedTracker)
    } catch (error) {
      console.log('Error checking done', error)
    }
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.msg}>
          {times === tracker.done[index] 
            ? 'Keep up the good work!' 
            : `Only ${freq === 'Yearly' 
              ? times - tracker.done.length 
              : times - tracker.done[index]} more to go!`
          }
        </Text> */}
      <Text style={styles.title}>
        {freq === 'Daily' ? 'Today' : freq === 'Weekly' ? 'This week' : freq === 'Monthly' ? 'This month' : 'This year'}
      </Text> 
      {freq === 'Daily' && times === 1 
      ? <>
        <Text style={[
          styles.status, 
          { color: times === tracker.done[index] ? Colors.green : Colors.red }
        ]}>
          {tracker.done[index] === 1 ? 'You did it!' : 'Mark as done?'}
        </Text>
        <View style={styles.scrollCalendar}>
          <ScrollCalendar careId={careId} tracker={tracker} index={index} onCheckDone={checkDone} onUncheckDone={uncheckDone}/>
        </View>
      </> : <>
        <View style={styles.countBox}>
          <Text style={[
            styles.status, 
            { color: times === tracker.done[index] ? Colors.green : Colors.red }
          ]}>
            {times === tracker.done[index] ? 'You did it!' : 'Mark as Done?'}
          </Text>

          <View style={styles.countContent}>
            <TouchableOpacity 
              style={styles.iconBtn}
              onPress={() => uncheckDone(careId, tracker._id, index)}
              disabled={tracker.done[index] == 0}
            >
              <Image source={require('../assets/icons/minus.png')} style={styles.icon as ImageStyle} />
            </TouchableOpacity>
            <Text style={[styles.count, { color: Colors.red }]}>{times - tracker.done[index]}</Text>

            <View style={styles.heartBtn}>
              <ProgressTracker done={tracker.done[index]} times={times} />
            </View>

            <Text style={[styles.count, { color: Colors.green }]}>{tracker.done[index]}</Text>
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => checkDone(careId, tracker._id, index)}
              disabled={tracker.done[index] >= times}
            >
              <Image source={require('../assets/icons/plus.png')} style={styles.icon as ImageStyle} />
            </TouchableOpacity>
            
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
  count: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 5,
  },
  countContent: {
    ...Spacing.flexRow,
    alignItems: 'center'
  },
  status: {
    fontSize: 15,
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
    marginVertical: 10,
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
    borderRadius: 8,
    marginVertical: 10
  },
  icon: {
    width: 30,
    height: 30
  },
  iconBtn: {
    marginHorizontal: 10
  }
})

export default TrackerPanel