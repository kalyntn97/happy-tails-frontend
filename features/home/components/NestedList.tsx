//npm
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
//components
import SwipeableCareTask from './SwipeableTasks/SwipeableCareTask'
import SwipeableHealthTask from './SwipeableTasks/SwipeableHealthTask'
import { EmptyList } from '@components/UIComponents'
//store
import { useHealthInterval } from '@store/store'
//types & utils
import type { HomeTabScreenProps } from '@navigation/types'
import type { Care } from '@care/CareInterface'
import type { Health, Visit } from '@health/HealthInterface'
import { Feed } from '@home/HomeInterface'
import { shouldRenderCareTask, shouldRenderHealthTask } from '@home/helpers'
import { Typography } from '@styles/index'

interface NestedListProps {
  data: Array<any>
  type: Feed
  navigation: HomeTabScreenProps
  activeDateObj: Date
  onPressTask: (item: Care | Health, type: string) => void
}

const NestedList = ({ data, type, navigation, activeDateObj, onPressTask }: NestedListProps) => {
  const [counts, setCounts] = useState({ care: 0, health: 0 })
  const healthInterval = useHealthInterval()
  const windowWidth = useWindowDimensions().width
  
  const renderItem = (item: any) => {
    if (type === 'care' && shouldRenderCareTask(item, activeDateObj)) {
      return <SwipeableCareTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item, 'care')} />

    } else if (type === 'health' && shouldRenderHealthTask(item, activeDateObj, healthInterval)) {
      //*show future tasks based on user's selected interval, show completed tasks for the whole month
      let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
        new Date(visit.date).getMonth() === activeDateObj.getMonth() && new Date(visit.date).getFullYear() === activeDateObj.getFullYear()
      ).sort((a: Visit, b: Visit) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const pastVisit: Visit = filteredVisits.length > 1 ? filteredVisits.find(visit => activeDateObj > new Date(visit.date)) : filteredVisits[0]
      
      return <SwipeableHealthTask key={item._id} health={item} navigation={navigation} onPress={() => onPressTask(item, 'health')} pastVisit={pastVisit} />
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
        if (type === 'health' && shouldRenderHealthTask(item, activeDateObj, healthInterval)) healthCounter++
      })
      setCounts({ care: careCounter, health: healthCounter })
    }
    checkCount()
  }, [activeDateObj])

  return (
    <View style={[styles.list, { width: windowWidth * 0.95 }]}>
      { type === 'health' && <Text style={styles.header}>Due in {healthInterval} days:</Text> }
      {data.map(item =>  renderItem(item))}
      { counts[type] === 0 && <EmptyList type='task' /> }
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    
  },
  header: {
    ...Typography.smallHeader,
  }
})

export default NestedList