//npm
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import React, { FC, useRef, useState } from 'react'
//components
import { SquareButton } from '@components/ButtonComponent'
import { AlertForm } from '@utils/ui'
import PetInfo from '@components/PetInfo/PetInfo'
//types & queries
import { useCheckDoneHealth, useUncheckDoneHealth } from '@health/healthQueries'
import { Health, Visit } from '@health/HealthInterface'
//styles
import { styles } from './SwipeableTaskStyles'
import Colors from '@styles/colors'
import CustomDialogInput from '@components/CustomDialogInput'


interface SwipeableHealthTaskProps {
  health: Health
  onPress: any
  pastVisit: Visit
  navigation: any
}

const SwipeableHealthTask: FC<SwipeableHealthTaskProps> = ({ health, onPress, pastVisit, navigation }) => {
  const checkDoneMutation = useCheckDoneHealth()
  const uncheckDoneMutation = useUncheckDoneHealth()

  const swipeableRef = useRef(null)

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }
  
  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      <SquareButton title='Edit' onPress={() => {
        // navigation.navigate('Care', { screen: 'Edit', params: { care: care }, initial: false })
        closeSwipeable()
      }} />
      <SquareButton title='Details' onPress={() => {
        // navigation.navigate('Care', { screen: 'Details', params: { care: care }, initial: false })
        closeSwipeable()
      }} />

      <SquareButton title='Delete' />
    </View>
  )

  const checkDone = async () => {
    !pastVisit ? 
      checkDoneMutation.mutate({ date: health.nextDue, notes: '', healthId: health._id }, {
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
      : uncheckDoneMutation.mutate({ healthId: health._id, visitId: pastVisit._id }, {
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
  }

  return (
    <Swipeable ref={swipeableRef} renderRightActions={() => rightSwipeActions()}>
      <TouchableOpacity
        key={health._id}
        style={[
          styles.task, 
          { backgroundColor: Colors.redArray[2] }
        ]} 
        onPress={onPress}
      > 
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
          ]}>
            {health.vaccine && <Text>{health.vaccine} </Text>}
            {health.name}
          </Text>
          {pastVisit && <Text style={styles.taskStatus}>{new Date(pastVisit.date).toLocaleDateString()}</Text>}
          {!pastVisit && <Text style={styles.taskStatus}>{new Date(health.nextDue).toLocaleDateString()}</Text>}
          <View style={styles.taskPetList}>
            <PetInfo pet={health.pet} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => checkDone()}>
          {pastVisit && <Image source={require('@assets/icons/check.png')} style={styles.check} /> }
          {!pastVisit && <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>

      
    </Swipeable>
  )
}

export default SwipeableHealthTask