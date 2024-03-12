//npm
import { View, Text, Modal, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { FC } from 'react'
//components
import SwipeableTask from '@components/SwipeableTask'
import { getDateConstructor } from '@care/careHelpers'
//types
import { Care } from '@care/CareInterface'

interface FlatListProps {
  data: Care[]
  navigation: any
  activeDateObj: Date
  onPressTask: (care: Care) => void
}

const CustomFlatList: FC<FlatListProps> = ({ data, navigation, activeDateObj, onPressTask }) => {

  const EmptyList: FC  = () => (
    <Text style={styles.empty}>No tasks to manage.</Text>
  )

  return (
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
          && activeDateObj.toDateString() == new Date(item.date).toDateString()
        if (isRepeating || isOneTime) {
          return <SwipeableTask key={item._id} care={item} navigation={navigation} onPress={() => onPressTask(item)} />
        } else {
          return null //not render anything if conditions are not met
        }
      }}
      ListEmptyComponent={ <EmptyList /> }
      alwaysBounceVertical={false}
    />
  )
}

const styles = StyleSheet.create({
  empty: {
    marginTop: 100,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
})

export default CustomFlatList