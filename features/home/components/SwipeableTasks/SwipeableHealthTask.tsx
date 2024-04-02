//npm
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import React, { FC, useEffect, useRef, useState } from 'react'
//components
import { IconButton } from '@components/ButtonComponent'
import { AlertForm } from '@utils/ui'
import PetInfo from '@components/PetInfo/PetInfo'
//types & queries & hooks
import { Health, Visit } from '@health/HealthInterface'
import { useCheckDoneHealth, useUncheckDoneHealth } from '@health/healthQueries'
import { useDeleteHealthCard, useShallowPetColor } from '@home/hooks'
//styles
import { styles } from '@styles/SwipeableTaskStyles'
import Colors from '@styles/colors'
import { useShallowPetBasics } from '@store/storeUtils'


interface SwipeableHealthTaskProps {
  health: Health
  onPress: any
  done: boolean
  pastVisit: Visit
  navigation: any
}

const SwipeableHealthTask: FC<SwipeableHealthTaskProps> = ({ health, onPress, done, pastVisit, navigation }) => {
  const checkDoneMutation = useCheckDoneHealth()
  const uncheckDoneMutation = useUncheckDoneHealth()
  const { showDeleteConfirmDialog, handleDeleteHealthCard } = useDeleteHealthCard(navigation)
  const { petIdToColor } = useShallowPetColor()
  
  const swipeableRef = useRef(null)

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }
  
  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      <IconButton type='edit' size='medium' onPress={() => {
        navigation.navigate('Health', { screen: 'Edit', params: { health: health }, initial: false })
        closeSwipeable()
      }} />
      <IconButton type='details' size='medium' onPress={() => {
        navigation.navigate('Health', { screen: 'Details', params: { healthId: health._id }, initial: false })
        closeSwipeable()
      }} />

      <IconButton type='delete' size='medium' onPress={() => showDeleteConfirmDialog(health, handleDeleteHealthCard)} />
    </View>
  )

  const toggleDone = async () => {
    !pastVisit ? 
      checkDoneMutation.mutate({ date: health.nextDue.date, notes: '', healthId: health._id }, {
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
          { backgroundColor: Colors.multiArray3[petIdToColor(health.pet._id) ?? health.pet.color] }
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
          {!pastVisit && <Text style={styles.taskStatus}>{new Date(health.nextDue.date).toLocaleDateString()}</Text>}
          <View style={styles.taskPetList}>
            <PetInfo pet={health.pet} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => toggleDone()}>
          {pastVisit && <Image source={require('@assets/icons/check.png')} style={styles.check} /> }
          {!pastVisit && <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>

      
    </Swipeable>
  )
}

export default SwipeableHealthTask