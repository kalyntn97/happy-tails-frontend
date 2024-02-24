//npm
import { useState, useEffect } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//services & utils
import { Tracker } from "../../services/careService"
import { Care } from "../../services/careService"
import * as careUtils from "../../utils/careUtils"
//components
import ScrollCalendar from "../Charts/ScrollCalendar"
//context
import { useCareContext } from "../../context/CareContext"
//styles
import { Spacing, Typography, Colors } from '../../styles'

interface CurrentTrackerProps {
  care: Care
}

const TrackerPanel: React.FC<CurrentTrackerProps> = ({ care }) => {
  const [tracker, setTracker] = useState<Tracker>(care.trackers[care.trackers.length - 1])
  const [index, setIndex] = useState<number>(0)

  const {frequency: freq, times, _id: careId } = care
  const {onCheckDone, onUncheckDone } = useCareContext()

  // get month and year of current tracker from name
  const { monthName: currMonth, year: currYear } = careUtils.getCurrentDate()
  
  const checkDone = async (careId: string, trackerId: string, index: number) => {
    const updatedTracker = await onCheckDone!(careId, trackerId, index)
    setTracker(updatedTracker)
  }

  const uncheckDone = async (careId: string, trackerId: string, index: number) => {
    const updatedTracker = await onUncheckDone!(careId, trackerId, index)
    setTracker(updatedTracker)
  }

  useEffect(() => {
    // update as index (day, week) change, get the latest tracker
    const updateIndex = () => {
      
      const updatedIdx = careUtils.getCurrentTrackerIndex(freq)
      setIndex(updatedIdx)
    }
    updateIndex()
  }, [index])

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        {freq === 'Daily' ? 'Today' 
          : freq === 'Weekly' ? `Week ${index + 1}` 
          : freq === 'Monthly' ? currMonth
          : currYear
        }
      </Text>
      <Text style={[
        styles.status, 
        { color: times === tracker.done[index] ? Colors.green : Colors.red }
      ]}>
        {tracker.done[index] === times ? 'You did it! ' : `Only ${times - tracker.done[index]} more to go! `}
        {tracker.done[index] !== times && 
          <Image source={require('../../assets/icons/hand.png')} style={styles.scrollCalendarIcon} />
        }
      </Text>
      {times === 1 && freq !== 'Yearly'
        ? <>
          <View style={styles.scrollCalendar}>
            <ScrollCalendar careId={careId} tracker={tracker} index={index} onCheckDone={checkDone} onUncheckDone={uncheckDone} frequency={freq} />
          </View>
        </> : <>
          <View style={styles.countBox}>
            <TouchableOpacity 
              style={styles.iconBtn}
              onPress={() => uncheckDone(careId, tracker._id, index)}
              disabled={tracker.done[index] == 0}
            >
              <Image source={require('../../assets/icons/minus.png')} style={styles.icon } />
            </TouchableOpacity>

            <Text style={[styles.count, { color: times === tracker.done[index] ? Colors.green : Colors.red }]}>
              {tracker.done[index]} / {times}
            </Text>

            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => checkDone(careId, tracker._id, index)}
              disabled={tracker.done[index] >= times}
            >
              <Image source={require('../../assets/icons/plus.png')} style={styles.icon } />
            </TouchableOpacity>
            
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
  count: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 5,
  },
  countBox: {
    ...Spacing.flexRow,
    marginVertical: 10
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 35,
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
    height: '40%',
    borderRadius: 8,
    marginVertical: 10
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBtn: {
    marginHorizontal: 10
  },
  scrollCalendarIcon: {
    width: 25,
    height: 25,
    transform: [{ rotate: '180deg' }]
  },
})

export default TrackerPanel