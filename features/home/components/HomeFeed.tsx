//npm
import React, { useCallback, useState } from 'react'
import { ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native"
//types & helpers
//store & queries
import { useGetProfile } from "@profile/profileQueries"
import { useFullActiveDate } from "@store/store"
//components
import { TransparentButton } from "@components/ButtonComponents"
import Loader from "@components/Loader"
import PlaceHolder from "@components/PlaceHolder"
import { ErrorImage, HScrollContainer, Icon } from "@components/UIComponents"
import DraggableList from './DraggableList'
//types & utils
import { Feed, Filter } from "@home/HomeInterface"
import { Task } from '@task/taskInterface'
import { isItemVisible } from "@utils/misc"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'

interface HomeFeedProps {
  navigation: any
}

const defaultFeeds: Feed[] = ['tasks', 'events']

const iconWidth = 50
const padding = 10
const conWidth = iconWidth + padding * 2

const buttons: { key: Feed, title: string, icon: string}[] = [
  { key: 'tasks', title: 'tasks', icon: 'careColor' },
  { key: 'events', title: 'events', icon: 'healthColor' },
]

const FeedFilter = ({ selectedFeed, onSelect }: { selectedFeed: Feed, onSelect: (feed: Feed) => void }) => {
  const buttonStyles = useCallback((feed: Feed, index: number) => {
    const iconCon = [styles.iconCon, { padding: padding, backgroundColor: selectedFeed === feed ? Colors.multi.lightest[index] : 'transparent', height: conWidth, width: conWidth }] as unknown as ViewStyle
    const icon = selectedFeed === feed ? { width: iconWidth, height: iconWidth } : { width: iconWidth + 5, height: iconWidth + 5 } as ImageStyle
    const text = [selectedFeed === feed ? Typography.focused : Typography.unFocused, { textTransform: 'capitalize' }] as unknown as TextStyle
    return { iconCon, icon, text }
  }, [selectedFeed])

  return (
    <HScrollContainer b={0}>
      { buttons.map((button, index) => {
        const { iconCon, icon, text } = buttonStyles(button.key, index)
        return (
          <Pressable key={button.key} style={[Spacing.flexColumn, index < buttons.length - 1 ? { marginRight: 15 } : {}]} onPress={() => onSelect(button.key)}>
            <View style={iconCon}>
              <Icon name={button.icon} styles={icon} />
            </View>
            <Text style={text}>{button.title}</Text>
          </Pressable>    
        )
      }) }
    </HScrollContainer>
  )
}


const filters: { key: Filter, label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'oneTime', label: 'One-time' },
  { key: 'days', label: 'Daily' },
  { key: 'weeks', label: 'Weekly' },
  { key: 'months', label: 'Monthly' },
  { key: 'years', label: 'Yearly' },
]

const FrequencyFilter = ({ filter, onSelect }: { filter: Filter, onSelect: (selected: Filter) => void }) => (
  <HScrollContainer>
    { filters.map((f, index) => {
      const isSelected = f.key === filter
      const buttonStyles = { paddingVertical: 0, marginRight: index < filters.length - 1 ? 5 : 0, ...(isSelected ? styles.selectedBtn : {}) }
      const textStyles = { fontWeight: isSelected ? 'bold' : 'normal', fontSize: 12 }
      const color = isSelected ? Colors.black : Colors.shadow.dark
      return (
        <TransparentButton key={f.key} title={f.label} size="xSmall" onPress={() => onSelect(f.key)} buttonStyles={buttonStyles} textStyles={textStyles as TextStyle} color={color} />
      )
    })}
  </HScrollContainer>
)

const FilterList = ({ tasks, filter }: { tasks: Task[], filter: Filter }) => {
  const activeDate = useFullActiveDate()

  const filtered = (filter === 'all' ? tasks : tasks.filter(task => task.frequency.type === filter))
    .filter(task => isItemVisible(task, activeDate))
    .map(task => ({ type: 'tasks' as const, item: task }))

  return <DraggableList initialData={filtered} />
}

const HomeFeed = ({ navigation }: HomeFeedProps) => {
  const [selectedFeed, setSelectedFeed] = useState<Feed>(defaultFeeds[0])
  const [filter, setFilter] = useState<Filter>('all')
  //queries
  const { data, isFetching, isSuccess, isError } = useGetProfile()

  return (  
    <View style={Spacing.fullScreenDown}>
      <FeedFilter selectedFeed={selectedFeed} onSelect={setSelectedFeed} />

      { isFetching && <Loader /> }
      { isError && <ErrorImage /> }

      { isSuccess && <>
        { selectedFeed === 'tasks' ? 
          data.tasks.length > 0 ? <>
            <FrequencyFilter filter={filter} onSelect={(selected: Filter) => setFilter(selected)} />
            <FilterList tasks={data.tasks} filter={filter} />
          </> : <PlaceHolder type={'task'} />
        : <PlaceHolder type={'event'} /> }
      </> }
    </View>
  )
}

const styles = StyleSheet.create({
  rowCon: {
    ...Spacing.flexRowStretch,
  },
  detailContainer: {
    width: '100%',
    height: '65%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  selectedBtn: {
    backgroundColor: UI.lightPalette().lightAccent, 
    borderWidth: 0, 
  },
  iconCon: {
    ...Spacing.centered,
    borderRadius: 99,
    marginBottom: 10,
  },
})

export default HomeFeed