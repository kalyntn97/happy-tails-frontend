//npm
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import React, { FC, useEffect, useRef, useState } from 'react'
//components
import { IconButton } from '@components/ButtonComponent'
import { AlertForm, getActionIconSource } from '@utils/ui'
import PetInfo from '@components/PetInfo/PetInfo'
//types & queries & hooks
import { Health, Visit } from '@health/HealthInterface'
import { useCheckDoneHealth, useUncheckDoneHealth } from '@health/healthQueries'
import { useDeleteHealthCard, useShallowPetColor } from '@hooks/sharedHooks'
import { HEALTHS } from '@health/healthHelpers'
//styles
import { styles } from '@styles/SwipeableTaskStyles'
import Colors from '@styles/colors'


interface SwipeableHealthTaskProps {
  health: Health
  onPress: any
  pastVisit: Visit
  navigation: any
}

const SwipeableHealthTask: FC<SwipeableHealthTaskProps> = ({ health, onPress, pastVisit, navigation }) => {
  const checkDoneMutation = useCheckDoneHealth()
  const uncheckDoneMutation = useUncheckDoneHealth()
  const { showDeleteConfirmDialog, handleDeleteHealthCard } = useDeleteHealthCard(navigation)
  const petIdToColor = useShallowPetColor()
  const petColor = petIdToColor(health.pet._id)
  
  const swipeableRef = useRef(null)

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }
  
  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      <IconButton type='edit' size='medium' onPress={() => {
        navigation.navigate('HealthEdit', { health: health })
        closeSwipeable()
      }} />
      <IconButton type='details' size='medium' onPress={() => {
        navigation.navigate('HealthDetails', { healthId: health._id })
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
          { backgroundColor: Colors.multi.light[petColor ?? health.pet.color] }
        ]} 
        onPress={onPress}
      > 
        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
          ]}>
            { HEALTHS[health.name] ?? health.name }
          </Text>
          {pastVisit && <Text style={styles.taskStatus}>{new Date(pastVisit.date).toLocaleDateString()}</Text>}
          {!pastVisit && <Text style={styles.taskStatus}>{new Date(health.nextDue.date).toLocaleDateString()}</Text>}
          <View style={styles.taskPetList}>
            <PetInfo pet={health.pet} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => toggleDone()}>
          {pastVisit && <Image source={getActionIconSource('check')} style={styles.check} /> }
          {!pastVisit && <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>

      
    </Swipeable>
  )
}

export default SwipeableHealthTask