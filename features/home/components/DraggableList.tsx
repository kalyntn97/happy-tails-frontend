//npm
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import DraggableFlatList, { RenderItemParams, ShadowDecorator } from 'react-native-draggable-flatlist'
//components
import SwipeableCareTask from './SwipeableTasks/SwipeableCareTask'
import SwipeableHealthTask from './SwipeableTasks/SwipeableHealthTask'
import { EmptyList } from '@components/UIComponents'
//store
import { useHealthInterval } from '@store/store'
//types & utils
import { centerHeight, shouldRenderCareTask, shouldRenderHealthTask } from '@home/helpers'
import type { HomeTabScreenProps } from '@navigation/types'
import type { Care } from '@care/CareInterface'
import type { Health, Visit } from '@health/HealthInterface'
import { Feed } from '@home/HomeInterface'
import { Typography } from '@styles/index'

interface DraggableListProps {
  initialData: any
  type: Feed
  navigation: HomeTabScreenProps
  activeDateObj: Date
  onPressTask: (item: Care | Health, type: string) => void
}

const DraggableList= ({ initialData, type, navigation, activeDateObj, onPressTask }: DraggableListProps) => {
  const [counts, setCounts] = useState({ care: 0, health: 0 })
  const healthInterval = useHealthInterval()
  const [data, setData] = useState(initialData)
  
  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    if (type === 'care' && shouldRenderCareTask(item, activeDateObj)) {
      return (
        <ShadowDecorator>
          <SwipeableCareTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item, 'care')} onLongPress={drag} disabled={isActive} />
        </ShadowDecorator>
      )
    } else if (type === 'health' && shouldRenderHealthTask(item, activeDateObj, healthInterval)) {
      //*show future tasks based on user's selected interval, show completed tasks for the whole month
      let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
        new Date(visit.date).getMonth() === activeDateObj.getMonth() && new Date(visit.date).getFullYear() === activeDateObj.getFullYear()
      ).sort((a: Visit, b: Visit) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const pastVisit: Visit = filteredVisits.length > 1 ? filteredVisits.find(visit => activeDateObj > new Date(visit.date)) : filteredVisits[0]
      
      return (
        <ShadowDecorator>
          <SwipeableHealthTask key={item._id} health={item} navigation={navigation} onPress={() => onPressTask(item, 'health')} pastVisit={pastVisit} onLongPress={drag} disabled={isActive} />
        </ShadowDecorator>
      )
    } else {
      return null
    }
  }

  useEffect(() => {
    setData(initialData)
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
  }, [activeDateObj, initialData])

  return (
    <View style={styles.list}>
      { type === 'health' && <Text style={styles.header}>Due in {healthInterval} days:</Text> }
      { counts[type] === 0 ? <EmptyList type='task' /> : 
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setData(data)}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          containerStyle={{ minHeight: centerHeight }}
        />
      }
      
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    width: '95%',
  },
  header: {
    ...Typography.smallHeader,
  }
})

export default DraggableList