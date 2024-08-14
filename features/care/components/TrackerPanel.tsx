//npm
import { useState, useEffect } from "react"
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as Progress from 'react-native-progress'
//types & helpers
import { Care, Tracker } from "@care/CareInterface"
import * as careHelpers from "@care/careHelpers"
//components
import ScrollChart from "@components/Charts/ScrollChart"
//utils, store
import { useActiveDate } from "@store/store"
import { getMonth } from "@utils/datetime"
//styles
import { Spacing, Typography, Colors, UI } from '@styles/index'
import { useCheckDoneCare,  useUncheckDoneCare } from "@care/careQueries"
import { AlertForm, getActionIconSource } from "@utils/ui"
import { useQueryClient } from "@tanstack/react-query"
import { profileKeyFactory } from "@profile/profileQueries"
import { ProfileData } from "@profile/ProfileInterface"
import { updateTrackerData } from "@home/helpers"

interface CurrentTrackerProps {
  care: Care
}

const TrackerPanel: React.FC<CurrentTrackerProps> = ({ care }) => {
  const {frequency, _id: careId } = care
  
  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()
  const activeMonthName = getMonth(activeMonth + 1)

  const checkDoneMutation = useCheckDoneCare()
  const uncheckDoneMutation = useUncheckDoneCare()
  let trackerIndex: number, index: number

  //get the active trackerIndex or default to latest tracker
  if (care.repeat) {
    trackerIndex = careHelpers.getTrackerIndex(care.trackers, care.frequency, activeMonth, activeYear)
    index = careHelpers.getTaskIndex(frequency, activeDate, activeWeek, activeMonth)
  } else {
    trackerIndex = 0
    index = 0
  }
  //set displaying tracker
  const [tracker, setTracker] = useState<Tracker>(care.trackers[trackerIndex])
  const times = care.repeat ? care.times : 1
  const done = tracker.done[index].value
  const progress = done / times
  const color = Colors.multi.dark[care.color]
  
  const queryClient = useQueryClient()
  const checkDone = (careId: string, trackerId: string, index: number) => {
    checkDoneMutation.mutate({ careId, trackerId, index }, {
      onSuccess: (data: Tracker) => {
        queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => updateTrackerData(oldData, data, careId, trackerId, care.frequency))
        setTracker(data)
      },
    })
  }

  const uncheckDone = async (careId: string, trackerId: string, index: number) => {
    uncheckDoneMutation.mutate({ careId, trackerId, index }, {
      onSuccess: (data: Tracker) => {
        queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => updateTrackerData(oldData, data, careId, trackerId, care.frequency))
        setTracker(data)
      },
    })
  }

  return (
    <View style={Spacing.flexColumnStretch}>
      <Text style={styles.title}>
        { care.repeat 
        ? careHelpers.getTrackerDisplayName(frequency, activeDate, activeWeek, activeMonthName, activeYear)
        : new Date(care.date).toLocaleDateString()
        }
      </Text>
      <Text style={styles.status}>
        {tracker.done[index].value === times ? 'You did it! ' : `Only ${times - tracker.done[index].value} more to go! `}
      </Text>
     
      <View style={styles.countBox}>
        <TouchableOpacity 
          style={styles.iconBtn}
          onPress={() => uncheckDone(careId, tracker._id, index)}
          disabled={tracker.done[index].value === 0}
        >
          <Image source={getActionIconSource('decrease')} style={styles.icon } />
        </TouchableOpacity>

        <Progress.Circle progress={progress} showsText={true} formatText={() => `${progress * 100}%`} color={color} size={80} thickness={5} borderWidth={2} borderColor={color} />

        <TouchableOpacity 
          style={styles.iconBtn} 
          onPress={() => checkDone(careId, tracker._id, index)}
          disabled={tracker.done[index].value >= times}
        >
          <Image source={getActionIconSource('increase')} style={styles.icon } />
        </TouchableOpacity>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  countBox: {
    ...Spacing.flexRow,
    marginVertical: 10,
  },
  status: {
    ...Typography.smallSubHeader,
    margin: 0,
  },
  title: {
    ...Typography.smallHeader,
    marginVertical: 10,
  },
  icon: {
    ...UI.icon(),
  },
  iconBtn: {
    marginHorizontal: 15,
  },
})

export default TrackerPanel