//npm
import { View, Text, Modal, Pressable, FlatList, StyleSheet, useWindowDimensions } from 'react-native'
import React, { FC, useCallback, useEffect, useState } from 'react'
//components
import SwipeableCareTask from './SwipeableTasks/SwipeableCareTask'
import SwipeableHealthTask from './SwipeableTasks/SwipeableHealthTask'
import EmptyList from '@components/EmptyList'
//types & utils
import { Care } from '@care/CareInterface'
import { Health, Visit } from '@health/HealthInterface'
import { getDateConstructor, getDateInfo, getStartDate } from '@utils/datetime'
//styles
import { Spacing } from '@styles/index'
import { useReminderInterval } from '@store/store'
import { shouldRenderCareTask, shouldRenderHealthTask } from '@home/helpers'

interface NestedListProps {
  data: Array<any>
  type: string
  navigation: any
  activeDateObj: Date
  onPressTask: (item: Care | Health, type: string) => void
}

const NestedList: FC<NestedListProps> = ({ data, type, navigation, activeDateObj, onPressTask }) => {
  const [counts, setCounts] = useState({ care: 0, health: 0 })
  const reminderInterval = useReminderInterval()
  const windowWidth = useWindowDimensions().width
  
  const renderItem = (item: any) => {
    if (type === 'care' && shouldRenderCareTask(item, activeDateObj)) {
      return <SwipeableCareTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item, 'Care')} />

    } else if (type === 'health' && shouldRenderHealthTask(item, activeDateObj, reminderInterval)) {
      //*show future tasks based on user's selected interval, show completed tasks for the whole month
      let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
        new Date(visit.date).getMonth() === activeDateObj.getMonth() && new Date(visit.date).getFullYear() === activeDateObj.getFullYear()
      ).sort((a: Visit, b: Visit) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const pastVisit: Visit = filteredVisits.length > 1 ?filteredVisits.find(visit => activeDateObj < new Date(visit.date)) : filteredVisits[0]
      
      return <SwipeableHealthTask key={item._id} health={item} navigation={navigation} onPress={() => onPressTask(item, 'Health')} pastVisit={pastVisit} />
    } else {
      return null
    }
  }

  useEffect(() => {
    const checkCount = () => {
      let careCounter = 0
      let healthCounter = 0
      data.forEach(item => {
        if (type === 'care' && shouldRenderCareTask(item, activeDateObj)) careCounter++
        if (type === 'health' && shouldRenderHealthTask(item, activeDateObj, reminderInterval)) healthCounter++
      })
      setCounts({ care: careCounter, health: healthCounter })
    }
    checkCount()
  }, [activeDateObj])

  return (
    <View style={[styles.list, { width: windowWidth * 0.95 }]}>
      {data.map(item =>  renderItem(item))}
      { counts[type] === 0 && <EmptyList /> }
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    
  },
})

export default NestedList