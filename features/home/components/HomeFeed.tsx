//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, Pressable } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
//store & queries
import { useUpdateStreak } from "@profile/profileQueries"
import { useActiveDate, useActiveTaskCounts, useCurrentIsActive, useSetActions } from "@store/store"
import { AlertForm, getCalendarIconSource, getNavigationIconSource } from "@utils/ui"
//components
import CareCard from "@care/components/CareCard"
import { CloseButton } from "../../../components/ButtonComponent"
import Loader from "@components/Loader"
import PlaceHolder from "@components/PlaceHolder"
import NestedList from './NestedList';
import HealthCard from "@health/components/HealthCard"
//utils & store
import { useUserQueries } from "../homeQueries"
import { getMonth } from "@utils/datetime"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'

interface HomeFeedProps {
  navigation: any
}

type ClickedTask = {
  item: Care | Health
  type: string
}

const HomeFeed: React.FC<HomeFeedProps> = ({ navigation }) => {
  const [feed, setFeed] = useState<string>('care')
  const [selected, setSelected] = useState<string>('day')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedTask, setClickedTask] = useState<ClickedTask>(null)
  //queries
  const [profile, pets, cares, healths] = useUserQueries()
  const isLoading = useUserQueries().some(query => query.isLoading)
  const isSuccess = useUserQueries().every(query => query.isSuccess)
  const isError = useUserQueries().some(query => query.isError)
  //store
  const { setPets, setCares, setHealths } = useSetActions()
  
  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()
  const activeDateObj = new Date(activeYear, activeMonth, activeDate + 1)
  const activeMonthName = getMonth(activeMonth + 1)
  
  const { date: currDateIsActive, week: currWeekIsActive, month: currMonthIsActive, year: currYearIsActive } = useCurrentIsActive()

  const handleClickTask = (item: Care | Health, type: string) => {
    setClickedTask({ item, type })
    setModalVisible(true)
  }
  

  useEffect(() => {
    if (isSuccess) {
      setPets(pets.data)
      setCares(Object.values(cares.data).flat())
      setHealths(healths.data)
      // setReminderInterval(profile.data.reminderInterval)
      
      // const daysElapsed = countDaysBetween(profile.data.streak.lastDate, new Date())
      // if (daysElapsed >= 1) {
      //   updateStreakMutation.mutate(null, {
      //     // onSuccess: () => {

      //     // },
      //     onError: (error) => {
      //       return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      //     }
      //   })
      // }
    }
  }, [pets.data, cares.data, healths.data, profile.data])

  return (  
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCon}>  
        <TouchableOpacity onPress={() => setFeed('care')} style={[
          styles.iconHeaderCon, feed === 'care' && { borderColor: Colors.pink.dark },
        ]}>
          <Image source={getNavigationIconSource('care', feed === 'care' ? 'active' : 'inactive')} style={{...Forms.smallIcon}} />
          <Text style={[styles.iconHeaderText, feed === 'care' && { color: Colors.pink.dark }]}>Pet care</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFeed('health')} style={[
          styles.iconHeaderCon,feed === 'health' && { borderColor: Colors.pink.dark },
        ]}>
          <Image source={getNavigationIconSource('health', feed === 'health' ? 'active' : 'inactive')} style={{...Forms.smallIcon}} />
          <Text style={[styles.iconHeaderText, feed === 'health' && { color: Colors.pink.dark }]}>Pet health</Text>
        </TouchableOpacity>
      </View>

      { isLoading && <Loader /> }
      { isError && <Text>Error fetching data... </Text> }
      
      {feed === 'health' && isSuccess &&
        <View style={styles.taskListContainer}>
          <NestedList data={healths.data} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='health' />
        </View>
      }

      {feed === 'care' && isSuccess &&
        <>
          <View style={styles.iconMenuContainer}>
            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
              <Image source={getCalendarIconSource('day', selected === 'day' ? 'active' : 'inactive')} style={{...Forms.icon}} />
              <Text style={[styles.iconText, selected === 'day' ? {...Typography.focused} : {...Typography.unFocused}]}>
                { currDateIsActive && currMonthIsActive ? 'Today' : `${activeMonthName} ${activeDate + 1}` }
              </Text>
          
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
              <Image source={getCalendarIconSource('week', selected === 'week' ? 'active' : 'inactive')} style={{...Forms.icon}} />
              <Text style={[styles.iconText, selected === 'week' ? {...Typography.focused} : {...Typography.unFocused}]}>
                { currWeekIsActive && currMonthIsActive ? 'This Week' 
                : `Week ${activeWeek + 1}` }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
              <Image source={getCalendarIconSource('month', selected === 'month' ? 'active' : 'inactive')} style={{...Forms.icon}} />
              <Text style={[styles.iconText, selected === 'month' ? {...Typography.focused} : {...Typography.unFocused}]}>       
                {currMonthIsActive ? 'This Month' : activeMonthName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
              <Image source={getCalendarIconSource('year', selected === 'year' ? 'active' : 'inactive')} style={{...Forms.icon}} />
              <Text style={[styles.iconText, selected === 'year' ? {...Typography.focused} : {...Typography.unFocused}]}>
                {currYearIsActive ? 'This Year' : activeYear}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.taskListContainer}>
            {Object.values(cares.data).length > 0 ?
              <>
                {selected === 'day' &&
                  <NestedList data={[...cares.data['Daily'], ...cares.data['Others']]} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='care' />
                }
                
                {selected === 'week' &&
                  <NestedList data={cares.data['Weekly']} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='care' />
                }

                {selected === 'month' && 
                  <NestedList data={cares.data['Monthly']} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='care' />
                }

                {selected === 'year' && 
                  <NestedList data={cares.data['Yearly']} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='care' />
                }
              </>
            : <PlaceHolder navigation={navigation}/> }

          </View>
        </>
      }

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => setClickedTask(null)}
        transparent={true}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={{ ...Forms.modal }}> 
          <View style={styles.detailContainer}>
            {clickedTask &&
              <>
                {clickedTask.type === 'care' ?
                  <CareCard care={clickedTask.item as Care} navigation={navigation} onNavigate={() => setModalVisible(false)}/>
                :
                clickedTask.type === 'health' ?
                  <HealthCard health={clickedTask.item as Health} navigation={navigation} onNavigate={() => setModalVisible(false)} activeDateObj = {activeDateObj} />
                : 
                  null}
              </>
            }
          </View>
        </Pressable>
      </Modal> 
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  headerCon: {
    ...Spacing.flexRow,
    width: '100%',
    padding: 10,
  },
  iconHeaderCon: {
    ...Spacing.flexRow,
    width: '45%',
    ...Spacing.centered,
    marginHorizontal: 5,
    borderBottomWidth: 1.5,
    borderColor: Colors.shadow.darkest,
  },
  iconHeaderText: {
    ...Typography.xSmallHeader,
    color: Colors.shadow.darkest,
    margin: 10,
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  iconMenuContainer: {
    ...Spacing.flexRow,
    width: '100%',
    marginVertical: 10,
  },
  singleIconMenu: {
    ...Spacing.flexColumn,
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
  taskCount: {
    
  },
  taskListContainer : {
    width: '90%',
    // height: '80%',
  },
  taskIcon: {
    ...Forms.smallIcon,
  },
  mainBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.pink.reg,
    marginTop: 50
  },
  btnText: {
    ...Buttons.buttonText,
  },
  detailContainer: {
    width: '100%',
    height: '65%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  empty: {
    marginTop: 100,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subscript: {
    position: 'absolute',
    top: 0
  },
  disabled: {
    opacity: 0.5
  },
})
 
export default HomeFeed