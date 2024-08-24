//npm
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import DraggableFlatList, { RenderItemParams, ShadowDecorator } from 'react-native-draggable-flatlist'
//components
import PetList from '@components/PetInfo/PetList'
import SwipeableItem from '@components/SwipeableItem'
//store & hooks
import { useDeleteCareCard, useDeleteHealthCard } from '@hooks/sharedHooks'
//types & utils
import type { Care } from '@care/CareInterface'
import type { Health } from '@health/HealthInterface'
import type { ClickedItem, Feed } from '@home/HomeInterface'
import { centerHeight } from '@utils/constants'
//styles
import { BottomModal } from '@components/UIComponents'
import { Colors, Spacing, Typography } from '@styles/index'
import { PetBasic } from '@pet/PetInterface'
import CareCard from '@care/components/CareCard'
import HealthCard from '@health/components/HealthCard'
import { ActionButton } from '@components/ButtonComponents'
import { useActiveDateString, useFullActiveDate } from '@store/store'
import { getLocaleDateString } from '@utils/datetime'

type ListItem = { type: Feed, item: any }
interface DraggableListProps {
  initialData: ListItem[]
}

interface ItemProps {
  onPress: () => void
  onLongPress: () => void
  disabled: boolean
}

const ItemContent = ({ name, petArray }: { name: string, petArray: PetBasic[] }) => (
  <View style={styles.itemContent}>
    <Text style={styles.itemTitle}>{name}</Text>
    <PetList petArray={petArray} size='xxSmall' />
  </View>
)

const getCareActions = (item: Care) => {
  const navigation = useNavigation()
  const handleDeleteCare = useDeleteCareCard(navigation)

  return ([
    { icon: 'edit', bgColor: 'yellow', onPress: () => navigation.navigate('CareEdit', { care: item }) },
    { icon: 'details', bgColor: 'green', onPress: () => navigation.navigate('CareDetails', { care: item }) },
    { icon: 'deleteColor', title: 'delete', bgColor: 'red', onPress: () => handleDeleteCare(item) },
  ])
}

const getHealthActions = (item: Health) => {
  const navigation = useNavigation()
  const handleDeleteHealth = useDeleteHealthCard(navigation)

  return ([
    { icon: 'edit', bgColor: 'yellow', onPress: () => navigation.navigate('HealthEdit', { health: item }) },
    { icon: 'details', bgColor: 'green', onPress: () => navigation.navigate('HealthDetails', { health: item }) },
    { icon: 'deleteColor', title: 'delete', bgColor: 'red', onPress: () => handleDeleteHealth(item) },
  ])
}

const ItemActions = ({ listItem }: { listItem: ListItem }) => {
  const actions = listItem.type === 'care' ? getCareActions(listItem.item) : getHealthActions(listItem.item)

  return (
    <View style={styles.actionCon}>
      { actions.map(action => 
        <ActionButton key={action.icon} icon={action.icon} size='xSmall' onPress={action.onPress} />
      )}
    </View>
  )
}

const HealthItem = ({ item, onPress, onLongPress, disabled }: { item: Health } & ItemProps) => {
  const toggleAll = () => {

  }

  return (
    <SwipeableItem
      color={Colors.multi.light[item.pet.color]}
      title={item.name}
      content={<ItemContent name={item.name} petArray={item.pet} />}
      swipeRightActions={getHealthActions(item)}
      onPress={onPress}
      onLongPress={onLongPress}
      toggle={{ onToggle: toggleAll, isChecked: false }}
      disabled={disabled}
  />
  )
}

const CareItem = ({ item, onPress, onLongPress, disabled }: { item: Care } & ItemProps) => {
  const activeDate = useFullActiveDate()

  const isChecked = item.logs.some(log => getLocaleDateString(log.date) === activeDate.toLocaleDateString())

  const toggleAll = () => {
    
  }
  
  return (
    <SwipeableItem
      color={Colors.multi.light[item.color]}
      title={item.name}
      content={<ItemContent name={item.name} petArray={item.pets} />}
      swipeRightActions={getCareActions(item)}
      onPress={onPress}
      onLongPress={onLongPress}
      toggle={{ onToggle: toggleAll, isChecked: isChecked }}
      disabled={disabled}
    />
  )
}

const renderItem = ({ item: listItem, drag, isActive }: RenderItemParams<any>) => {
  const [clickedItem, setClickedItem] = useState<ClickedItem>(null)

  const handlePress = () => setClickedItem(listItem)

  const props = { item: listItem.item, onPress: handlePress, onLongPress: drag, disabled: isActive }
  const bgColor = listItem.type === 'care' ? listItem.item.color : listItem.item.pet.color

  return ( 
    <>
      <ShadowDecorator>
        {listItem.type === 'care' ? 
          <CareItem {...props} />
          : <HealthItem {...props} />
        }
      </ShadowDecorator>

      <BottomModal modalVisible={!!clickedItem} onDismiss={() => setClickedItem(null)} background={Colors.multi.lightest[bgColor]}>
        <ItemActions listItem={listItem} />

        { listItem.type === 'care' ? 
          <CareCard care={listItem.item} />
          : <HealthCard health={listItem.health} />
        }
      </BottomModal>
    </>
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
        keyExtractor={listItem => listItem.item._id}
        renderItem={renderItem}
        alwaysBounceVertical={false}
        // containerStyle={{ minHeight: centerHeight }}
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
  },
  actionCon: {
    ...Spacing.flexRow,
    width: '40%',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 15,
    top: 15,
  },
})

export default DraggableList