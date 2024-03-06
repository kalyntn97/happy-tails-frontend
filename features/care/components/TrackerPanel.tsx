//npm
import { useState, useEffect } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//types & helpers
import { Care, Tracker } from "@care/CareInterface"
import * as careHelpers from "@care/careHelpers"
//components
import ScrollChart from "@components/Charts/ScrollChart"
//utils, store
import { useActiveCareDate, useActiveCareMonth, useActiveCareWeek, useActiveCareYear } from "@store/store"
import { getCurrentDate, getMonth } from "@utils/datetime"
//styles
import { Spacing, Typography, Colors } from '@styles/index'
import { useCheckDoneCare,  useUncheckDoneCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"

interface CurrentTrackerProps {
  care: Care
}

const TrackerPanel: React.FC<CurrentTrackerProps> = ({ care }) => {
  const {frequency: freq, times, _id: careId } = care
  const { date: currDate, monthName: currMonth, year: currYear } = getCurrentDate()

  const activeCareDate = useActiveCareDate()
  const activeCareWeek = useActiveCareWeek()
  const activeCareMonth = useActiveCareMonth()
  const activeCareMonthName = getMonth(activeCareMonth + 1)
  const activeCareYear = useActiveCareYear()

  const checkDoneMutation = useCheckDoneCare()
  const uncheckDoneMutation = useUncheckDoneCare()

  //get the active trackerIndex
  const testIndex = careHelpers.getTrackerIndex(care.trackers, care.frequency, activeCareMonth, activeCareYear)
 //set trackerIndex or default to latest tracker
  const trackerIndex = testIndex !== -1 ? testIndex : (care.trackers.length - 1)
  //set displaying tracker
  const [tracker, setTracker] = useState<Tracker>(care.trackers[trackerIndex])

  //get the latest taskIndex
  const latestTaskIndex = careHelpers.getCurrentTrackerIndex(care.frequency)
  //set task index
  const index = (
    care.frequency === 'Daily' ? activeCareDate 
    : care.frequency === 'Weekly' ? activeCareWeek 
    : care.frequency === 'Monthly' ? activeCareMonth 
    : null
  ) ?? latestTaskIndex //default
  console.log('trackerIdx', trackerIndex, 'index', index)

  const checkDone = (careId: string, trackerId: string, index: number) => {
    checkDoneMutation.mutate({ careId, trackerId, index }, {
      onSuccess: (data) => {
        setTracker(data)
      },
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      },
    })
  }

  const uncheckDone = async (careId: string, trackerId: string, index: number) => {
    uncheckDoneMutation.mutate({ careId, trackerId, index }, {
      onSuccess: (data) => {
        setTracker(data)
      },
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      },
    })
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        {freq === 'Daily' ? activeCareDate + 1 === currDate ? 'Today' : `${activeCareMonthName} ${activeCareDate + 1}`
          : freq === 'Weekly' ? `Week ${activeCareWeek + 1}` 
          : freq === 'Monthly' ? activeCareMonthName === currMonth ? 'This Month' : activeCareMonthName
          : activeCareYear === currYear ? activeCareYear : currYear
        }
      </Text>
      <Text style={[
        styles.status, 
        { color: times === tracker.done[index] ? Colors.green : Colors.red }
      ]}>
        {tracker.done[index] === times ? 'You did it! ' : `Only ${times - tracker.done[index]} more to go! `}
        {tracker.done[index] !== times && 
          <Image source={require('@assets/icons/hand.png')} style={styles.ScrollChartIcon} />
        }
      </Text>
      {times === 1 && freq !== 'Yearly'
        ? <>
          <View style={styles.ScrollChart}>
            <ScrollChart careId={careId} tracker={tracker} index={index} onCheckDone={checkDone} onUncheckDone={uncheckDone} frequency={freq} />
          </View>
        </> : <>
          <View style={styles.countBox}>
            <TouchableOpacity 
              style={styles.iconBtn}
              onPress={() => uncheckDone(careId, tracker._id, index)}
              disabled={tracker.done[index] === 0}
            >
              <Image source={require('@assets/icons/minus.png')} style={styles.icon } />
            </TouchableOpacity>

            <Text style={[styles.count, { color: times === tracker.done[index] ? Colors.green : Colors.red }]}>
              {tracker.done[index]} / {times}
            </Text>

            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => checkDone(careId, tracker._id, index)}
              disabled={tracker.done[index] >= times}
            >
              <Image source={require('@assets/icons/plus.png')} style={styles.icon } />
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
  ScrollChart: {
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
  ScrollChartIcon: {
    width: 25,
    height: 25,
    transform: [{ rotate: '180deg' }]
  },
})

export default TrackerPanel