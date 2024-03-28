//npm
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useRef } from 'react'
//components
import { SquareButton } from '@components/ButtonComponent'
//types
import { Health } from '@health/HealthInterface'
import { Swipeable } from 'react-native-gesture-handler'
import PetInfo from '@components/PetInfo/PetInfo'
//styles
import { styles } from './SwipeableTaskStyles'
import Colors from '@styles/colors'
import { Image } from 'react-native'

interface SwipeableHealthTaskProps {
  health: Health
  onPress: any
  done: boolean
  due: boolean
  activeDateObj: Date
  doneDate: Date
  navigation: any
}

const SwipeableHealthTask: FC<SwipeableHealthTaskProps> = ({ health, onPress, done, due, activeDateObj, doneDate, navigation }) => {
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
          {done && doneDate && <Text style={styles.taskStatus}>{new Date(doneDate).toLocaleDateString()}</Text>}
          {due && <Text style={styles.taskStatus}>{new Date(health.nextDue).toLocaleDateString()}</Text>}
          <View style={styles.taskPetList}>
            <PetInfo pet={health.pet} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn}>
          {done && <Image source={require('@assets/icons/check.png')} style={styles.check} /> }
          {due && <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>
    </Swipeable>
  )
}

export default SwipeableHealthTask