//npm
import { FC, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
//types & helpers
import { Care } from '@care/CareInterface'
import * as careHelpers from '@care/careHelpers'
//store & queries & hooks
import { useCheckAllDoneCare, useUncheckAllDoneCare } from '@care/careQueries'
import { useDeleteCareCard } from '@care/careHooks'
//components
import { useActiveDate } from '@store/store'
import { AlertForm } from '@utils/ui'
import { SquareButton } from './ButtonComponent'
import ScrollPetList from './PetInfo/ScrollPetList'
//styles
import { Spacing, Forms } from '@styles/index'

interface SwipeableTaskProps {
  care: Care
  taskIndex?: number
  navigation: any
  onPress: any
}

const SwipeableTask: FC<SwipeableTaskProps> = ({ care, navigation, onPress }) => {
  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()
  const checkAllDoneMutation = useCheckAllDoneCare()
  const uncheckAllDoneMutation = useUncheckAllDoneCare()
  const { showDeleteConfirmDialog } = useDeleteCareCard(navigation)
  
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
  
  const checkAllDone = async (care: Care) => {
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
        navigation.navigate('Care', { screen: 'Edit', params: { care: care }, initial: false })
        closeSwipeable()
      }} />
      {care.repeat &&
        <SquareButton title='Details' onPress={() => {
          navigation.navigate('Care', { screen: 'Details', params: { care: care }, initial: false })
          closeSwipeable()
        }} />
      }
      <SquareButton title='Delete' onPress={() => showDeleteConfirmDialog(care)} />
    </View>
  )

  return (
    <Swipeable ref={swipeableRef} renderRightActions={() => rightSwipeActions()}>
      <TouchableOpacity 
        key={care._id}
        style={[
          styles.task, 
          { backgroundColor: careHelpers.getTaskBackgroundColor(care.frequency) }
        ]} 
        onPress={onPress}
      > 
        <View style={styles.taskContent}>
          <Text style={[
            done === times && styles.done, 
            styles.taskText
          ]}>
            {care.name}
          </Text>
          <Text style={styles.taskStatus}>{done}/{times}</Text>
          <View style={styles.taskPetList}>
            <ScrollPetList petArray={care.pets} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => checkAllDone(care)}>
          {done === times 
          ? <Image source={require('@assets/icons/check.png')} style={styles.check}/>
          : <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  task: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    marginVertical: 5,
    ...Spacing.flexRow,
    justifyContent: 'space-between'
  },
  taskContent: {
    ...Spacing.flexRow,
    justifyContent: 'space-around',
    flex: 6,
    paddingHorizontal: 10,
  },
  taskText: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 3
  },
  taskStatus: {
    flex: 1,
    fontSize: 12,
  },
  taskPetList: {
    flex: 2
  },
  bulletBtn: {
    marginRight: 20,
  },
  bulletBtnText: {
    fontSize: 25,
    fontWeight: '100'
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  squareBtnContainer: {
    ...Spacing.flexRow,
    height: 70,
    marginLeft: 10
  },
  check: {
    width: 25,
    height: 25,
  }
})

export default SwipeableTask