//npm
import { useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Pressable } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
//store & queries
import { useGetProfile } from "@profile/profileQueries"
import { useActiveDate, useCurrentIsActive } from "@store/store"
import { getCalendarIconSource, getNavigationIconSource } from "@utils/ui"
//components
import CareCard from "@care/components/CareCard"
import Loader from "@components/Loader"
import PlaceHolder from "@components/PlaceHolder"
import NestedList from './DraggableList'
import HealthCard from "@health/components/HealthCard"
import { ErrorImage } from "@components/UIComponents"
//types & utils
import { ClickedTask, Feed, Selection } from "@home/HomeInterface"
import { getMonth } from "@utils/datetime"
//styles
import { Spacing, Forms, Colors, Typography } from '@styles/index'

const HomeFeed = ({ navigation }) => {
  const [feed, setFeed] = useState<Feed>('care')
  const [selected, setSelected] = useState<Selection>('day')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedTask, setClickedTask] = useState<ClickedTask>(null)
  //queries
  const { data, isFetching, isSuccess, isError } = useGetProfile()
  //store
  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()
  const activeDateObj = new Date(activeYear, activeMonth, activeDate + 1)
  const activeMonthName = getMonth(activeMonth + 1)
  
  const { date: currDateIsActive, week: currWeekIsActive, month: currMonthIsActive, year: currYearIsActive } = useCurrentIsActive()

  const caresByFreq = () => {
    const cares = {
      day: [...data.cares['Daily'], ...data.cares['Others']],
      week: data.cares['Weekly'], 
      month: data.cares['Monthly'],
      year: data.cares['Yearly']
    }
    return cares[selected]
  }

  const getIconText = (selection: Selection) => {
    const iconTexts = {
      day: () => (currDateIsActive && currMonthIsActive ? 'Today' : `${activeMonthName} ${activeDate + 1}`),
      week: () => (currWeekIsActive && currMonthIsActive ? 'This Week' : `Week ${activeWeek + 1}`),
      month: () => (currMonthIsActive ? 'This Month' : activeMonthName),
      year: () => (currYearIsActive ? 'This Year' : activeYear),
    }
    return iconTexts[selection]()
  }

  const handleClickTask = (item: Care | Health, type: string) => {
    setClickedTask({ item, type })
    setModalVisible(true)
  }

  return (  
    <View style={styles.container}>
      <View style={styles.headerCon}>  
        <TouchableOpacity onPress={() => setFeed('care')} style={[styles.iconHeaderCon, feed === 'care' && { borderColor: Colors.pink.dark }]}>
          <Image source={getNavigationIconSource('care', feed === 'care' ? 'active' : 'inactive')} style={{...Forms.smallIcon}} />
          <Text style={[styles.iconHeaderText, feed === 'care' && { color: Colors.pink.dark }]}>Pet care</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFeed('health')} style={[styles.iconHeaderCon,feed === 'health' && { borderColor: Colors.pink.dark }]}>
          <Image source={getNavigationIconSource('health', feed === 'health' ? 'active' : 'inactive')} style={{...Forms.smallIcon}} />
          <Text style={[styles.iconHeaderText, feed === 'health' && { color: Colors.pink.dark }]}>Pet health</Text>
        </TouchableOpacity>
      </View>

      { isFetching && <Loader /> }
      { isError && <ErrorImage /> }

      { isSuccess && <>
        { (feed === 'care' && Object.values(data.cares).flat().length > 0) || (feed === 'health' && data.healths.length > 0) ? <>
          { feed === 'care' && <View style={styles.iconMenuContainer}>
            {['day', 'week', 'month', 'year'].map((selection: Selection) =>
              <TouchableOpacity key={selection} style={styles.iconMenu} onPress={() => setSelected(selection)}>
                <Image source={getCalendarIconSource(selection, selected === selection ? 'active' : 'inactive')} style={{...Forms.icon}} />
                <Text style={[styles.iconText, selected === selection ? {...Typography.focused} : {...Typography.unFocused}]}>{getIconText(selection)}</Text>
              </TouchableOpacity>
            )}
          </View> }
        
          <NestedList data={feed === 'care' ? caresByFreq() : data.healths} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type={feed} />
          
        </> : <PlaceHolder type={feed === 'care' ? 'task' : 'vet'} navigation={navigation} /> }
      </> }

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => setClickedTask(null)}
        transparent={true}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={{ ...Forms.modal }}> 
          <View style={styles.detailContainer}>
            {clickedTask && <>
              { clickedTask.type === 'care' ? <CareCard care={clickedTask.item as Care} navigation={navigation} onNavigate={() => setModalVisible(false)} />
              : clickedTask.type === 'health' ? <HealthCard health={clickedTask.item as Health} navigation={navigation} onNavigate={() => setModalVisible(false)} activeDateObj = {activeDateObj} />
              : null }
            </> }
          </View>
        </Pressable>
      </Modal> 
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    ...Spacing.fullWH,
  },
  headerCon: {
    ...Spacing.flexRow,
    width: '100%',
    padding: 10,
  },
  iconHeaderCon: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    width: '45%',
    marginHorizontal: 5,
    borderBottomWidth: 1.5,
    borderColor: Colors.shadow.darkest,
  },
  iconHeaderText: {
    ...Typography.xSmallHeader,
    color: Colors.shadow.darkest,
    margin: 10,
  },
  iconMenuContainer: {
    ...Spacing.flexRow,
    width: '100%',
    marginVertical: 10,
  },
  iconMenu: {
    ...Spacing.flexColumn,
    flexBasis: '25%',
  },
  iconText: {
    ...Typography.xSmallBody,
    marginTop: -5,
  },
  taskListContainer : {
    width: '90%',
    ...Forms.scrollContent,
  },
  detailContainer: {
    width: '100%',
    height: '65%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
})

export default HomeFeed