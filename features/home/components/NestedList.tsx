//npm
import { View, Text, Modal, Pressable, FlatList, StyleSheet, useWindowDimensions } from 'react-native'
import React, { FC } from 'react'
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

interface NestedListProps {
  data: Array<any>
  type: string
  navigation: any
  activeDateObj: Date
  interval?: number
  onPressTask: (item: Care | Health, type: string) => void
}

const NestedList: FC<NestedListProps> = ({ data, type, navigation, activeDateObj, interval, onPressTask }) => {
  const windowWidth = useWindowDimensions().width

  const showTask = (item: any) => {
    if (type === 'Care') {
      const startDate = getDateConstructor(item.date)
      const endDate = item.endDate && getDateConstructor(item.endDate)
      const isRepeating = item.repeat //render repeating tasks between start and end dates
        && activeDateObj >= startDate 
        && (!endDate || activeDateObj <= endDate)
      const isOneTime = !item.repeat //only render one-time task on the date
        && activeDateObj.toLocaleDateString() == new Date(item.date).toLocaleDateString()
      if (isRepeating || isOneTime) {
        return <SwipeableCareTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item, 'Care')} />
      } else {
        return null
      }
    } else if (type === 'Health') {
      //*show future tasks based on user's selected interval, show completed tasks for the whole month
      const startDate = getStartDate(new Date(item.nextDue), interval) //start date to show task
      let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
        new Date(visit.date).getMonth() === activeDateObj.getMonth() && new Date(visit.date).getFullYear() === activeDateObj.getFullYear()
      ).sort((a: Visit, b: Visit) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const pastVisit: Visit = filteredVisits.length > 1 ?filteredVisits.find(visit => activeDateObj < new Date(visit.date)) : filteredVisits[0]
      const due: boolean = activeDateObj >= startDate
      const done: boolean = filteredVisits.length >= 1
      const show: boolean = due || done
      
      if (show) {
        return <SwipeableHealthTask key={item._id} health={item} navigation={navigation} onPress={() => onPressTask(item, 'Health')} done={done} pastVisit={pastVisit} />
      } else {
        return null
      }
    } else {
      return null
    }
  }

  return (
    <View style={[styles.list, { width: windowWidth * 0.95 }]}>
      {/* <FlatList 
        data={data}
        extraData={data}
        keyExtractor={(item, index) => item + index.toString()}
        renderItem={({ item }) => {
          if (type === 'Care') {
            const startDate = getDateConstructor(item.date)
            const endDate = item.endDate && getDateConstructor(item.endDate)
            const isRepeating = item.repeat //render repeating tasks between start and end dates
              && activeDateObj >= startDate 
              && (!endDate || activeDateObj <= endDate)
            const isOneTime = !item.repeat //only render one-time task on the date
              && activeDateObj.toLocaleDateString() == new Date(item.date).toLocaleDateString()
            if (isRepeating || isOneTime) {
              return <SwipeableCareTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item, 'Care')} />
            }
          } else if (type === 'Health') {
            //*show future tasks based on user's selected interval, show completed tasks for the whole month
            const startDate = getStartDate(new Date(item.nextDue), interval) //start date to show task
            let filteredVisits: Visit[] = item.lastDone.filter((visit: Visit) => 
              new Date(visit.date).getMonth() === activeDateObj.getMonth() && new Date(visit.date).getFullYear() === activeDateObj.getFullYear()
            ).sort((a: Visit, b: Visit) => new Date(a.date).getTime() - new Date(b.date).getTime())
            const pastVisit: Visit = filteredVisits.length > 1 ?filteredVisits.find(visit => activeDateObj < new Date(visit.date)) : filteredVisits[0]
            const due: boolean = activeDateObj >= startDate
            const done: boolean = filteredVisits.length >= 1
            const show: boolean = due || done
            
            if (show) {
              return <SwipeableHealthTask key={item._id} health={item} navigation={navigation} onPress={() => onPressTask(item, 'Health')} done={done} pastVisit={pastVisit} />
            }
          } else {
            return null //not render anything if conditions are not met
          }
        }}
        ListEmptyComponent={ <EmptyList /> }
        showsVerticalScrollIndicator={false}
      /> */}
      {data.length 
        ? data.map(item => showTask(item))
        : <EmptyList />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    
  },
})

export default NestedList