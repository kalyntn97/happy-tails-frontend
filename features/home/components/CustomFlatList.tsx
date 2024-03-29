//npm
import { View, Text, Modal, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { FC } from 'react'
//components
import SwipeableCareTask from './SwipeableTasks/SwipeableCareTask'
import SwipeableHealthTask from './SwipeableTasks/SwipeableHealthTask'
import { getDateConstructor, getDateInfo, getStartDate } from '@utils/datetime'
//types
import { Care } from '@care/CareInterface'
import { Health, Visit } from '@health/HealthInterface'
//styles
import { Spacing } from '@styles/index'

interface FlatListProps {
  data: Array<any>
  type: string
  navigation: any
  activeDateObj: Date
  interval?: number
  onPressTask: (item: Care | Health, type: string) => void
}

const CustomFlatList: FC<FlatListProps> = ({ data, type, navigation, activeDateObj, interval, onPressTask }) => {

  const EmptyList: FC  = () => (
    <Text style={styles.empty}>No tasks to manage.</Text>
  )

  return (
    <View style={styles.list}>
      <FlatList 
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
            const pastVisit: Visit = filteredVisits.find(visit => activeDateObj < new Date(visit.date))
            const show: boolean = activeDateObj >= startDate 
              || !!pastVisit
            
            if (show) {
              return <SwipeableHealthTask key={item._id} health={item} navigation={navigation} onPress={() => onPressTask(item, 'Health')} pastVisit={pastVisit} />
            }
          } else {
            return null //not render anything if conditions are not met
          }
        }}
        ListEmptyComponent={ <EmptyList /> }
        showsVerticalScrollIndicator={false}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  empty: {
    marginTop: 100,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  list: {
    width: '100%'
  },
})

export default CustomFlatList