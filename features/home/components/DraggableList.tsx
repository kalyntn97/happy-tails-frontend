//npm
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import DraggableFlatList, { RenderItemParams, ShadowDecorator } from 'react-native-draggable-flatlist'
//components
import SwipeableItem from '@components/SwipeableItem'
import PetList from '@components/PetInfo/PetList'
//store & hooks
import { useDeleteCareCard, useDeleteHealthCard } from '@hooks/sharedHooks'
//types & utils
import type { Feed } from '@home/HomeInterface'
import type { Care } from '@care/CareInterface'
import type { Health } from '@health/HealthInterface'
import { centerHeight } from '@utils/constants'
//styles
import { Colors, Spacing, Typography } from '@styles/index'

interface DraggableListProps {
  initialData: { type: Feed, item: any }[]
  // type: Feed
  // navigation: HomeTabScreenProps
  // activeDateObj: Date
  // onPressTask: (item: Care | Health, type: string) => void
}

interface ItemProps {
  onLongPress: () => void
  disabled: boolean
}

const HealthItem = ({ item, onLongPress, disabled }: { item: Health } & ItemProps) => {
  const navigation = useNavigation()
  const handleDeleteHealth = useDeleteHealthCard(navigation)

  const handlePress = () => {

  }

  const toggleAll = () => {

  }

  const actions = [
    { key: 'edit', bgColor: 'yellow', onPress: () => navigation.navigate('HealthEdit', { health: item }) },
    { key: 'details', bgColor: 'green', onPress: () => navigation.navigate('HealthDetails', { health: item }) },
    { key: 'delete', bgColor: 'red', onPress: () => handleDeleteHealth(item) },
  ]

  return (
    <SwipeableItem
      color={Colors.multi.light[item.pet.color]}
      title={item.name}
      content={
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <PetList petArray={item.pet} size='xxSmall' />
        </View>
      }
      swipeRightActions={actions}
      onPress={handlePress}
      onLongPress={onLongPress}
      toggle={{ onToggle: toggleAll, initial: false }}
      disabled={disabled}
  />
  )
}


const CareItem = ({ item, onLongPress, disabled }: { item: Care } & ItemProps) => {
  const navigation = useNavigation()

  const handleDeleteCare = useDeleteCareCard(navigation)

  const handlePress = () => {

  }

  const toggleAll = () => {

  }

  const actions = [
    { key: 'edit', bgColor: 'yellow', onPress: () => navigation.navigate('CareEdit', { care: item }) },
    { key: 'details', bgColor: 'green', onPress: () => navigation.navigate('CareDetails', { care: item }) },
    { key: 'delete', bgColor: 'red', onPress: () => handleDeleteCare(item) },
  ]

  return (
    <SwipeableItem
      color={Colors.multi.light[item.color]}
      title={item.name}
      content={
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <PetList petArray={item.pets} size='xxSmall' />
        </View>
      }
      swipeRightActions={actions}
      onPress={handlePress}
      onLongPress={onLongPress}
      toggle={{ onToggle: toggleAll, initial: false }}
      disabled={disabled}
    />
  )
}

const renderItem = ({ item: listItem, drag, isActive }: RenderItemParams<any>) => {
  const props = { item: listItem.item, onLongPress: drag, disabled: isActive }

  return ( 
    <ShadowDecorator>
      {listItem.type === 'care' ? 
        <CareItem {...props} />
        : <HealthItem {...props} />
      }
    </ShadowDecorator>
  )
}

const DraggableList= ({ initialData }: DraggableListProps) => {
  const [data, setData] = useState(initialData)
  
  // useEffect(() => {
  //   setData(initialData)
  //   const checkCount = () => {
  //     let careCounter = 0
  //     let healthCounter = 0
  //     data.forEach(item => {
  //       if (type === 'care' && shouldRenderCareTask(item, activeDateObj)) careCounter++
  //       if (type === 'health' && shouldRenderHealthTask(item, activeDateObj, healthInterval)) healthCounter++
  //     })
  //     setCounts({ care: careCounter, health: healthCounter })
  //   }
  //   checkCount()
  // }, [activeDateObj, initialData])

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  return (
    <View style={styles.list}>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        containerStyle={{ minHeight: centerHeight }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    width: '95%',
  },
  itemTitle: {
    ...Typography.focused,
    margin: 0,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
    ...Spacing.flexRow,
    justifyContent: 'space-between',
  }
})

export default DraggableList