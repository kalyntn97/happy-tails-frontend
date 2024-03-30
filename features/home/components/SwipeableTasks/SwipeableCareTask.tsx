//npm
import { FC, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
//types & helpers
import { Care } from '@care/CareInterface'
import * as careHelpers from '@care/careHelpers'
//store & queries & hooks
import { useCheckAllDoneCare, useUncheckAllDoneCare } from '@care/careQueries'
import { useDeleteCareCard } from '@home/hooks'
//components
import { useActiveDate } from '@store/store'
import { AlertForm } from '@utils/ui'
import { SquareButton } from '@components/ButtonComponent'
import ScrollPetList from '@components/PetInfo/ScrollPetList'
//styles
import { styles } from '@styles/SwipeableTaskStyles'
import Colors from '@styles/colors'

interface SwipeableCareTaskProps {
  care: Care
  taskIndex?: number
  navigation: any
  onPress: any
}

const SwipeableCareTask: FC<SwipeableCareTaskProps> = ({ care, navigation, onPress }) => {
  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()
  const checkAllDoneMutation = useCheckAllDoneCare()
  const uncheckAllDoneMutation = useUncheckAllDoneCare()
  const { showDeleteConfirmDialog, handleDeleteCareCard } = useDeleteCareCard(navigation)
  
  let trackerIndex: number, index: number, done: number
  const times = care.repeat ? care.times : 1
  //get the active trackerIndex or default to latest tracker
  if (care.repeat) {
    trackerIndex = careHelpers.getTrackerIndex(care.trackers, care.frequency, activeMonth, activeYear)
    //set task index
    index = careHelpers.getTaskIndex(care.frequency, activeDate, activeWeek, activeMonth, activeYear)
    //get task status
    done = careHelpers.getTaskStatus(care, trackerIndex, index)
  } else {
    trackerIndex = 0
    index = 0
    done = care.trackers[trackerIndex].done[0]
  }

  const careId = care._id
  const trackerId = care.trackers[trackerIndex]._id
  
  const toggleAllDone = async () => {
    done === times
      ? uncheckAllDoneMutation.mutate({ careId, trackerId, index }, {
        // onSuccess: () => {
        // },
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
      : checkAllDoneMutation.mutate({ careId, trackerId, index }, {
        // onSuccess: () => {
        // },
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
  }

  const swipeableRef = useRef(null)

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }
  
  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      <SquareButton title='Edit' onPress={() => {
        navigation.navigate('Care', { screen: 'Edit', params: { care }, initial: false })
        closeSwipeable()
      }} />
      {care.repeat &&
        <SquareButton title='Details' onPress={() => {
          navigation.navigate('Care', { screen: 'Details', params: { care }, initial: false })
          closeSwipeable()
        }} />
      }
      <SquareButton title='Delete' onPress={() => showDeleteConfirmDialog(care, handleDeleteCareCard)} />
    </View>
  )

  return (
    <Swipeable ref={swipeableRef} renderRightActions={() => rightSwipeActions()}>
      <TouchableOpacity 
        key={care._id}
        style={[
          styles.task, 
          { backgroundColor: Colors.multiArray3[care.color] }
        ]} 
        onPress={onPress}
      > 
        <View style={styles.taskContent}>
          <Text style={[
            done === times && styles.done, 
            styles.taskTitle
          ]}>
            {care.name}
          </Text>
          <Text style={styles.taskStatus}>{done}/{times}</Text>
          <View style={styles.taskPetList}>
            <ScrollPetList petArray={care.pets} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => toggleAllDone()}>
          {done === times 
          ? <Image source={require('@assets/icons/check.png')} style={styles.check}/>
          : <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>
    </Swipeable>
  )
}

export default SwipeableCareTask