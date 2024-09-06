import { useNavigation } from '@react-navigation/native'
import React, { ReactNode, useEffect, useState } from 'react'
import { StyleSheet, Text, TextStyle, View } from 'react-native'
import DraggableFlatList, { RenderItemParams, ShadowDecorator } from 'react-native-draggable-flatlist'
import * as Progress from 'react-native-progress'
//components
import CareCard from '@care/components/CareCard'
import { ActionButton } from '@components/ButtonComponents'
import PetList from '@components/PetInfo/PetList'
import SwipeableItem from '@components/SwipeableItem'
import { BottomModal } from '@components/UIComponents'
//store & hooks & queries
import { useCreateLog, useDeleteLog, useUpdateLog } from '@care/careQueries'
import { useDeleteCareCard, useDeleteHealthCard } from '@hooks/sharedHooks'
import { useFullActiveDate } from '@store/store'
//types & utils
import type { Care, Log } from '@care/CareInterface'
import HealthCard from '@health/components/HealthCard'
import type { Health } from '@health/HealthInterface'
import type { ClickedItem, Feed } from '@home/HomeInterface'
import { PetBasic } from '@pet/PetInterface'
import { getLocaleDateString } from '@utils/datetime'
//styles
import { Colors, Spacing, Typography } from '@styles/index'

type ListItem = { type: Feed, item: any }
interface DraggableListProps {
  initialData: ListItem[]
}

interface ItemProps {
  onPress: () => void
  onLongPress: () => void
  disabled: boolean
}

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

const Status = ({ progress, textStyles }: { progress: { value: number, color: number }, textStyles?: TextStyle }) => (
  <>
    { progress ?
      progress.value === -1 ? <Text style={[styles.itemStatus, textStyles]}>skipped</Text>
      : progress.value !== 1 && <Progress.Pie progress={progress.value} color={Colors.multi.darkest[progress.color]} borderColor={Colors.multi.darkest[progress.color]} size={20} borderWidth={1.5} /> 
      : null
    }
  </>
)

const ItemContent = ({ name, petArray, status, titleStyles }: { name: string, petArray: PetBasic[], progress?: { value: number, color: number }, titleStyles?: TextStyle, status?: ReactNode }) => (
  <View style={styles.itemContent}>
    <Text style={[styles.itemTitle, titleStyles]}>{name}</Text>
    { status }
    <PetList petArray={petArray} size='xxSmall' containerStyles={{ marginLeft: 15 }}/>
  </View>
)


const HealthItem = ({ item, onPress, onLongPress, disabled }: { item: Health } & ItemProps) => {
  const toggleAll = () => {

  }

  return (
    <SwipeableItem
      color={Colors.multi.light[item.pet.color]}
      title={item.name}
      content={<ItemContent name={item.name} petArray={[item.pet] as PetBasic[]} />}
      swipeRightActions={getHealthActions(item)}
      onPress={onPress}
      onLongPress={onLongPress}
      toggle={{ onToggle: toggleAll, isOn: false }}
      disabled={disabled}
  />
  )
}

const CareItem = ({ item, onPress, onLongPress, disabled }: { item: Care } & ItemProps) => {
  const activeDate = useFullActiveDate()
  const createLogMutation = useCreateLog()
  const deleteLogMutation = useDeleteLog()
  const updateLogMutation = useUpdateLog()

  const log = item.logs.find((log: Log) => getLocaleDateString(log.date) === activeDate.toLocaleDateString())

  const shouldIncrement = item.frequency.type === 'days' && item.frequency.timesPerInterval[0] > 1 && log

  const progress: number = shouldIncrement ?
    Number((log.value / item.frequency.timesPerInterval[0]).toFixed(2))
    : log ? log.value 
    : 0
  const isOn = progress === 1
  const isSkipped = progress === -1

  const toggleAll = () => {
    if (isOn) {
      deleteLogMutation.mutate({ logId: log._id, careId: item._id }) 
    } else {
      shouldIncrement ? 
        updateLogMutation.mutate({ ...log, value: item.frequency.timesPerInterval[0], logId: log._id })
        : createLogMutation.mutate({ date: activeDate.toISOString(), value: item.frequency.timesPerInterval[0], care: item._id })
    }
  }

  return (
    <SwipeableItem
      color={Colors.multi.light[item.color]}
      title={item.name}
      content={
        <ItemContent name={item.name} petArray={item.pets as PetBasic[]} titleStyles={isOn && styles.completed} status={
          <Status progress={shouldIncrement ? { value: progress, color: item.color } : null} />
        } />
      }
      swipeRightActions={getCareActions(item)}
      onPress={onPress}
      onLongPress={onLongPress}
      toggle={{ onToggle: toggleAll, isOn: isOn }}
      disabled={disabled || isSkipped}
      containerStyles={isSkipped && { opacity: 0.5 }}
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
  itemStatus: {
    ...Typography.focused,
    textTransform: 'uppercase',
    fontStyle: 'italic',
    fontSize: 16,
  },
  actionCon: {
    ...Spacing.flexRow,
    width: '40%',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 15,
    top: 15,
  },
  completed: {
    textDecorationLine: 'line-through', 
    fontStyle: 'italic',
  }
})

export default DraggableList