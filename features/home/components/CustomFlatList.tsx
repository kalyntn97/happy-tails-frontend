//npm
import { View, Text, Modal, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { FC } from 'react'
//components
import SwipeableCareTask from './SwipeableCareTask'
import SwipeableHealthTask from './SwipeableHealthTask'
import { getDateConstructor } from '@care/careHelpers'
//types
import { Care } from '@care/CareInterface'
import { Health } from '@health/HealthInterface'
//styles
import { Spacing } from '@styles/index'

interface FlatListProps {
  data: any[]
  type: string
  navigation: any
  activeDateObj: Date
  onPressTask: (care: Care) => void
}

const CustomFlatList: FC<FlatListProps> = ({ data, type, navigation, activeDateObj, onPressTask }) => {

  const EmptyList: FC  = () => (
    <Text style={styles.empty}>No tasks to manage.</Text>
  )

  return (
    <View style={styles.list}>
      {type === 'Care' &&
        <FlatList 
          data={data}
          extraData={data}
          keyExtractor={(item, index) => item + index.toString()}
          renderItem={({ item }) => {
            const startDate = getDateConstructor(item.date)
            const endDate = item.endDate && getDateConstructor(item.endDate)
            const isRepeating = item.repeat //render repeating tasks between start and end dates
              && activeDateObj >= startDate 
              && (!endDate || activeDateObj <= endDate)
            const isOneTime = !item.repeat //only render one-time task on the date
              && activeDateObj.toLocaleDateString() == new Date(item.date).toLocaleDateString()
            if (isRepeating || isOneTime) {
              return <SwipeableCareTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item)} />
            } else {
              return null //not render anything if conditions are not met
            }
          }}
          ListEmptyComponent={ <EmptyList /> }
          showsVerticalScrollIndicator={false}

        />
      }
      {type === 'Health' &&
        <FlatList 
          data={data}
          extraData={data}
          keyExtractor={(item, index) => item + index.toString()}
          renderItem={({ item }) => {
            const doneCon  = item.lastDone.some(date => new Date(date).toLocaleDateString() === activeDateObj.toLocaleDateString())
            const dueCon = new Date(item.nextDue).toLocaleDateString() === activeDateObj.toLocaleDateString()
            if (doneCon || dueCon) {
              return <SwipeableHealthTask key={item._id} health={item} navigation={navigation} />
            } else {
              return null //not render anything if conditions are not met
            }
          }}
          showsVerticalScrollIndicator={false}
        />
      }
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
    ...Spacing.fullWH,
  },
})

export default CustomFlatList