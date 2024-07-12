//npm
import { FC, useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import * as Progress from 'react-native-progress'
//types & helpers
import { Care, Tracker } from '@care/CareInterface'
import { updateTrackerData } from '@home/helpers'
import * as careHelpers from '@care/careHelpers'
import { profileKeyFactory } from '@profile/profileQueries'
import { ProfileData } from '@profile/ProfileInterface'
//queries & hooks
import { useCheckAllDoneCare, useUncheckAllDoneCare } from '@care/careQueries'
import { useDeleteCareCard } from '@hooks/sharedHooks'
//components
import SwipeableItem from '@components/SwipeableItem'
import { useActiveDate } from '@store/store'
import PetList from '@components/PetInfo/PetList'
//styles
import Colors from '@styles/colors'
import { styles } from './styles'

interface SwipeableCareTaskProps {
  care: Care
  taskIndex?: number
  navigation: any
  onPress?: any
  onLongPress?: any
  disabled?: boolean
}

const SwipeableCareTask = ({ care, navigation, onPress, onLongPress, disabled }: SwipeableCareTaskProps) => {
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
  
  const queryClient = useQueryClient()
  
  const toggleAllDone = async () => {
    done === times
      ? uncheckAllDoneMutation.mutate({ careId, trackerId, index }, {
        onSuccess: (data: Tracker) => {
          queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => updateTrackerData(oldData, data, careId, trackerId, care.frequency))
        },
      })
      : checkAllDoneMutation.mutate({ careId, trackerId, index }, {
        onSuccess: (data: Tracker) => {
          queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => updateTrackerData(oldData, data, careId, trackerId, care.frequency))
        },
      })
  }

  const toggle = { onToggle: toggleAllDone, initial: done === times }
  
  const actions = {
    edit: () => navigation.navigate('CareEdit', { care }),
    details: () => navigation.navigate('CareDetails', { care }),
    delete: () => showDeleteConfirmDialog(care, handleDeleteCareCard)
  }

  const { details, ...filteredActions } = actions

  const CareContent = () => (
    <>
      <Text style={[styles.taskTitle, done === times && styles.done]}>
        {careHelpers.CARES[care.name] ?? care.name}
      </Text>
      <Text style={styles.taskStatus}><Text style={{ fontSize: 15 }}>{done}</Text>/{times}</Text>
      <View style={styles.taskPetList}>
        <PetList petArray={care.pets} size='mini' />
      </View>
    </>
  )

  return (
    <SwipeableItem
      color={Colors.multi.light[care.color]}
      title={care.name}
      content={<CareContent />}
      swipeRightActions={care.repeat ? actions : filteredActions}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      toggle={toggle}
    />
  )
}

export default SwipeableCareTask