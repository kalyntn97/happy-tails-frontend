//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Modal, TouchableWithoutFeedback, Pressable, ListRenderItem } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
//store & queries
import { useActiveDate, useCurrentIsActive, useReminderInterval, useSetActions } from "@store/store"
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
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface HomeFeedProps {
  navigation: any
}

type ClickedTask = {
  item: Care | Health
  type: string
}

const HomeFeed: React.FC<HomeFeedProps> = ({ navigation }) => {
  const [selected, setSelected] = useState<string>('day')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedTask, setClickedTask] = useState<ClickedTask>(null)
  //queries
  const [profile, pets, cares, healths] = useUserQueries()
  const { setPets, setCares, setHealths, setReminderInterval } = useSetActions()
  //store
  const isLoading = useUserQueries().some(query => query.isLoading)
  const isSuccess = useUserQueries().every(query => query.isSuccess)
  const isError = useUserQueries().some(query => query.isError)
  
  const reminderInterval = useReminderInterval()
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
      setReminderInterval(profile.data.reminderInterval)
    }
  }, [pets.data, cares.data, healths.data, profile.data])

  return (  
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching data... </Text> }
      { isSuccess && 
        <>
          <View style={styles.singleIconMenu}>
            <Image source={require('@assets/icons/scheduled.png')} style={styles.icon} />
            <Text style={styles.iconText}>Important</Text>
          </View>
          <View style={styles.taskListContainer}>
            <NestedList data={healths.data} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='Health' interval={reminderInterval} />
          </View>

          <View style={styles.iconMenuContainer}>
            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
              <Text style={styles.taskCount}>{cares.data['Daily']?.length ?? 0}</Text>
              <Image source={require('@assets/icons/day.png')} style={styles.icon } />
              <Text style={[styles.iconText, selected === 'day' && styles.selected]}>
                { currDateIsActive && currMonthIsActive ? 'Today' : `${activeMonthName} ${activeDate + 1}` }
              </Text>
          
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
              <Text style={styles.taskCount}>{cares.data['Weekly']?.length ?? 0}</Text>
              <Image source={require('@assets/icons/week.png')} style={styles.icon } />
              <Text style={[styles.iconText, selected === 'week' && styles.selected]}>{ 
                currWeekIsActive && currMonthIsActive ? 'This Week' 
                : `Week ${activeWeek + 1}`
              }</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
              <Text style={styles.taskCount}>{cares.data['Monthly']?.length ?? 0}</Text>
              <Image source={require('@assets/icons/month.png')} style={styles.icon } />
              <Text style={[styles.iconText, selected === 'month' && styles.selected]}>{currMonthIsActive ? 'This Month' : activeMonthName}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
              <Text style={styles.taskCount}>{cares.data['Yearly']?.length ?? 0}</Text>
              <Image source={require('@assets/icons/year.png')} style={styles.icon } />
              <Text style={[styles.iconText, selected === 'year' && styles.selected]}>{currYearIsActive ? 'This Year' : activeYear}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.taskListContainer}>
            {!Object.keys(cares.data).length && <PlaceHolder /> }

            {selected === 'day' &&
              <NestedList data={[...cares.data['Daily'], ...cares.data['Others'] ?? []]} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='Care' />
            }
            
            {selected === 'week' &&
              <NestedList data={cares.data['Weekly'] ?? []} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='Care' />
            }

            {selected === 'month' && 
              <NestedList data={cares.data['Monthly'] ?? []} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='Care' />
            }

            {selected === 'year' && 
              <NestedList data={cares.data['Yearly'] ?? []} navigation={navigation} activeDateObj={activeDateObj} onPressTask={handleClickTask} type='Care' />
            }
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
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={styles.modalContainer}> 
          <View style={styles.detailContainer}>
            <CloseButton onPress={() => setModalVisible(false)} />
            {clickedTask &&
              <>
                {clickedTask.type === 'Care' ?
                  <CareCard care={clickedTask.item as Care} navigation={navigation} onNavigate={() => setModalVisible(false)}/>
                :
                clickedTask.type === 'Health' ?
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
  icon: {
    ...Forms.smallIcon,
  },
  iconText: {

  },
  taskCount: {
    color: Colors.red,
    fontWeight: 'bold',
    position: 'absolute',
    right: '25%',
    top: '15%',
  },
  selected: {
    color: Colors.red,
    fontWeight: 'bold',
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
    backgroundColor: Colors.pink,
    marginTop: 50
  },
  btnText: {
    ...Buttons.buttonText,
  },
  modalContainer: {
    ...Forms.modal,
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