//npm
import { FC, useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
//types & helpers
import { Care } from '@care/CareInterface'
import * as careHelpers from '@care/careHelpers'
//store & queries & hooks
import { useCheckAllDoneCare, useUncheckAllDoneCare } from '@care/careQueries'
import { useDeleteCareCard } from '@hooks/sharedHooks'
//components
import { useActiveDate } from '@store/store'
import { AlertForm, getActionIconSource } from '@utils/ui'
import { IconButton } from '@components/ButtonComponent'
import PetList from '@components/PetInfo/PetList'
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
    index = careHelpers.getTaskIndex(care.frequency, activeDate, activeWeek, activeMonth)
    //get task status
    done = careHelpers.getTaskStatus(care, trackerIndex, index)
  } else {
    trackerIndex = 0
    index = 0
    done = care.trackers[trackerIndex].done[0].value
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
      <IconButton type='edit' size='medium' onPress={() => {
        navigation.navigate('CareEdit', { care })
        closeSwipeable()
      }} />
      {care.repeat &&
        <IconButton type='details' size='medium' onPress={() => {
          navigation.navigate('CareDetails', { care })
          closeSwipeable()
        }} />
      }
      <IconButton type='delete' size='medium' onPress={() => showDeleteConfirmDialog(care, handleDeleteCareCard)} />
    </View>
  )

  return (
    <Swipeable ref={swipeableRef} renderRightActions={() => rightSwipeActions()}>
      <TouchableOpacity 
        key={care._id}
        style={[
          styles.task, 
          { backgroundColor: Colors.multi.light[care.color] }
        ]} 
        onPress={onPress}
      > 
        <View style={styles.taskContent}>
          <Text style={[
            done === times && styles.done, 
            styles.taskTitle
          ]}>
            {careHelpers.CARES[care.name] ?? care.name}
          </Text>
          <Text style={styles.taskStatus}><Text style={{ fontSize: 15 }}>{done}</Text>/{times}</Text>
          <View style={styles.taskPetList}>
            <PetList petArray={care.pets} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => toggleAllDone()}>
          {done === times 
          ? <Image source={getActionIconSource('check')} style={styles.check}/>
          : <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>
    </Swipeable>
  )
}

export default SwipeableCareTask