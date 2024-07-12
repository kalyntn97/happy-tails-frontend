//npm
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import React, { FC, useEffect, useRef, useState } from 'react'
//components
import { AlertForm } from '@utils/ui'
import PetInfo from '@components/PetInfo/PetInfo'
import SwipeableItem from '@components/SwipeableItem'
//types & queries & hooks
import { Health, Visit } from '@health/HealthInterface'
import { useCheckDoneHealth, useUncheckDoneHealth } from '@health/healthQueries'
import { useDeleteHealthCard, useShallowPets } from '@hooks/sharedHooks'
import { HEALTHS } from '@health/healthHelpers'
//styles
import Colors from '@styles/colors'
import { styles } from './styles'


interface SwipeableHealthTaskProps {
  health: Health
  onPress?: any
  pastVisit?: Visit
  navigation: any
  onLongPress?: () => void
  disabled?: boolean
}

const SwipeableHealthTask: FC<SwipeableHealthTaskProps> = ({ health, onPress, pastVisit, navigation, onLongPress, disabled }) => {
  const checkDoneMutation = useCheckDoneHealth()
  const uncheckDoneMutation = useUncheckDoneHealth()
  const { showDeleteConfirmDialog, handleDeleteHealthCard } = useDeleteHealthCard(navigation)
  const { petIdToColor } = useShallowPets()
  const petColor = petIdToColor(health.pet._id)

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

  const HealthContent = () => (
    <>
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
    </>
  )

  const actions = {
    edit: () => navigation.navigate('HealthEdit', { health: health }),
    details: () => navigation.navigate('HealthDetails', { healthId: health._id }),
    delete: () => () => showDeleteConfirmDialog(health, handleDeleteHealthCard)
  }

  const toggle = { onToggle: toggleDone, initial: !!pastVisit }

  return (
    <SwipeableItem 
      color={Colors.multi.light[petColor ?? health.pet.color]}
      title={health.name}
      content={<HealthContent />}
      swipeRightActions={actions}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      toggle={toggle}
    />
  )
}

export default SwipeableHealthTask
