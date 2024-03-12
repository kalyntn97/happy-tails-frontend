//npm
import { useState, useEffect } from "react"
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//types & helpers
import { Care, Tracker } from "@care/CareInterface"
import * as careHelpers from "@care/careHelpers"
//components
import ScrollChart from "@components/Charts/ScrollChart"
//utils, store
import { useActiveCareDate, useActiveCareMonth, useActiveCareWeek, useActiveCareYear, useActiveDate } from "@store/store"
import { getCurrentDate, getMonth } from "@utils/datetime"
//styles
import { Spacing, Typography, Colors } from '@styles/index'
import { useCheckDoneCare,  useUncheckDoneCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"

interface CurrentTrackerProps {
  care: Care
}

const TrackerPanel: React.FC<CurrentTrackerProps> = ({ care }) => {
  const {frequency: freq, _id: careId } = care
  const times = care.repeat ? care.times : 1
  
  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()
  const activeMonthName = getMonth(activeMonth + 1)

  const checkDoneMutation = useCheckDoneCare()
  const uncheckDoneMutation = useUncheckDoneCare()
  let trackerIndex: number, index: number

  //get the active trackerIndex or default to latest tracker
  if (care.repeat) {
    trackerIndex = careHelpers.getTrackerIndex(care.trackers, care.frequency, activeMonth, activeYear)
    index = careHelpers.getTaskIndex(freq, activeDate, activeWeek, activeMonth, activeYear)
  } else {
    trackerIndex = 0
    index = 0
  }
  //set displaying tracker
  const [tracker, setTracker] = useState<Tracker>(care.trackers[trackerIndex])

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
        { care.repeat 
        ? careHelpers.getTrackerDisplayName(freq, activeDate, activeWeek, activeMonthName, activeYear)
        : new Date(care.date).toLocaleDateString()
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
      {care.repeat && times === 1 && freq !== 'Yearly'
        ? <>
            <View style={styles.ScrollChart}>
              <Pressable>
                <ScrollChart careId={careId} tracker={tracker} index={index} onCheckDone={checkDone} onUncheckDone={uncheckDone} frequency={freq} />
              </Pressable>
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