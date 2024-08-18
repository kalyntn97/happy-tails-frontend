//npm
import { useCallback, useState } from "react"
import { ImageStyle, Modal, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
//store & queries
import { useGetProfile } from "@profile/profileQueries"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
//components
import CareCard from "@care/components/CareCard"
import Loader from "@components/Loader"
import PlaceHolder from "@components/PlaceHolder"
import { ErrorImage, Icon, ScrollHeader } from "@components/UIComponents"
import HealthCard from "@health/components/HealthCard"
import DraggableList from './DraggableList'
//types & utils
import { ClickedTask, Feed, Filter } from "@home/HomeInterface"
//styles
import { TransparentButton } from "@components/ButtonComponents"
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { showToast } from "@utils/misc"

interface HomeFeedProps {
  navigation: any
}

const defaultFeeds: Feed[] = ['care', 'health']

const iconWidth = 50
const padding = 10
const conWidth = iconWidth + padding * 2

const FeedFilter = ({ feeds, onSelect }: { feeds: Feed[], onSelect: (filter: Feed[]) => void }) => {
  const handleSelect = (filter: Feed) => {
    let updated = []
    if (feeds.includes(filter)) {
      if (feeds.length > 1) updated = feeds.filter(f => f!== filter)
      else {
        showToast({ text1: 'At least 1 selection is required.', style: 'info' })
        updated = feeds
      }
    } else updated = [...feeds, filter]
    onSelect(updated)
  }

  const buttons: { key: Feed, title: string, icon: string}[] = [
    { key: 'care', title: 'care', icon: 'care' },
    { key: 'health', title: 'health', icon: 'health' },
  ]

  const buttonStyles = useCallback((feed: Feed, index: number) => {
    const iconCon = [styles.iconCon, { padding: padding, backgroundColor: feeds.includes(feed) ? Colors.multi.lightest[index] : 'transparent', height: conWidth, width: conWidth }] as ViewStyle
    const icon = feeds.includes(feed) ? { width: iconWidth, height: iconWidth } : { width: iconWidth + 5, height: iconWidth + 5 } as ImageStyle
    const text = [feeds.includes(feed) ? Typography.focused : Typography.unFocused, { textTransform: 'capitalize' }] as TextStyle
    return { iconCon, icon, text }
  }, [feeds])

  return (
    <ScrollHeader b={0}>
      { buttons.map((button, index) => {
        const { iconCon, icon, text } = buttonStyles(button.key, index)
        return (
          <Pressable key={button.key} style={[Spacing.flexColumn, index < buttons.length - 1 ? { marginRight: 15 } : {}]} onPress={() => handleSelect(button.key)}>
            <View style={iconCon}>
              <Icon name={button.icon} styles={icon} />
            </View>
            <Text style={text}>{button.title}</Text>
          </Pressable>    
        )
      }) }
    </ScrollHeader>
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
  <ScrollHeader>
    { filters.map((f, index) => {
      const isSelected = f.key === filter
      const buttonStyles = { paddingVertical: 0, marginRight: index < filters.length - 1 ? 5 : 0, ...(isSelected ? styles.selectedBtn : {}) }
      const textStyles = { fontWeight: isSelected ? 'bold' : 'normal', fontSize: 12 }
      const color = isSelected ? Colors.black : Colors.shadow.dark
      return (
        <TransparentButton key={f.key} title={f.label} size="xSmall" onPress={() => onSelect(f.key)} buttonStyles={buttonStyles} textStyles={textStyles as TextStyle} color={color} />
      )
    })}
  </ScrollHeader>
)

const FilterList = ({ data, filter }: { data: { care: Care[], health: Health[] }, filter: Filter }) => {
  const filtered = (Object.keys(data) as ('care' | 'health')[]).flatMap(key => {
    const list = filter === 'all' ? data[key] : data[key].filter(item => item.frequency.type === filter)
    return list.map(item => ({ type: key, item }))
  })
  return (
    <DraggableList initialData={filtered} />
  )
}

const HomeFeed = ({ navigation }: HomeFeedProps) => {
  const [feeds, setFeeds] = useState<Feed[]>(defaultFeeds)
  const [filter, setFilter] = useState<Filter>('all')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedTask, setClickedTask] = useState<ClickedTask>(null)
  //queries
  const { data, isFetching, isSuccess, isError } = useGetProfile()

  const handleClickTask = (item: Care | Health, type: string) => {
    setClickedTask({ item, type })
    setModalVisible(true)
  }
  
  const listProps = { 
    navigation: navigation,
    onPressTask: handleClickTask,
    type: feeds
  }

  return (  
    <View style={Spacing.fullScreenDown}>
      <FeedFilter feeds={feeds} onSelect={setFeeds} />

      { isFetching && <Loader /> }
      { isError && <ErrorImage /> }

      { isSuccess && <>
        { (feeds.includes('care') && data.cares.length > 0) || (feeds.includes('health') && data.healths.length > 0) ? 
          <>
            <FrequencyFilter filter={filter} onSelect={(selected: Filter) => setFilter(selected)} />
            <FilterList data={{ care: data.cares, health: data.healths }} filter={filter} />

            {/* { feeds === 'care' ? 
              <>
                { filter === 'day' && <DraggableList initialData={[...sortByFrequency(data.cares)['days'], ...sortByFrequency(data.cares)['oneTime']]} { ...listProps } /> }
                { filter === 'week' && <DraggableList initialData={data.cares['Weekly']} { ...listProps } /> }
                { filter === 'month' && <DraggableList initialData={data.cares['Monthly']} { ...listProps } /> }
                { filter === 'year' && <DraggableList initialData={data.cares['Yearly']} { ...listProps } /> }
              </> : <DraggableList initialData={data.healths} { ...listProps } /> 
            } */}
          </> : <PlaceHolder type={feeds.includes('care') ? 'task' : 'vet'} navigation={navigation} />
        }
      </> }

      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => setClickedTask(null)}
        transparent={true}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={{ ...UI.modalOverlay }}> 
          <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.detailContainer}>
            {clickedTask && <>
              { clickedTask.type === 'care' ? <CareCard care={clickedTask.item as Care} navigation={navigation} onNavigate={() => setModalVisible(false)} />
              : clickedTask.type === 'health' ? <HealthCard health={clickedTask.item as Health} navigation={navigation} onNavigate={() => setModalVisible(false)} activeDateObj = {activeDateObj} />
              : null }
            </> }
          </Animated.View>
        </Pressable>
      </Modal> 
      
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