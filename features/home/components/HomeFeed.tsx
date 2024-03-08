//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Modal, TouchableWithoutFeedback, Pressable } from "react-native"
import { useQueries } from "@tanstack/react-query"
//types & helpers
import { Care } from "@care/CareInterface"
import * as careHelpers from '@care/careHelpers'
//store & queries
import { useActiveDate, useCurrentIsActive, useSetActions } from "@store/store"
//components
import CareCard from "@care/components/CareCard"
import SwipeableTask from "@components/SwipeableTask"
import { CloseButton } from "../../../components/ButtonComponent"
import Loader from "@components/Loader"
import PlaceHolder from "@components/PlaceHolder"
import ScrollSelector from "@components/ScrollSelector"
//utils & store
import { useUserQueries } from "../homeQueries"
import { getCurrentDate, getMonth, getYears, months } from "@utils/datetime"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface HomeFeedProps {
  navigation: any
}

const HomeFeed: React.FC<HomeFeedProps> = ({ navigation }) => {
  const [selected, setSelected] = useState<string>('day')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedCare, setClickedCare] = useState<Care>({})
  //queries
  const [profile, pets, cares, healths] = useUserQueries()
  const { setPets } = useSetActions()
  //store
  const isLoading = useUserQueries().some(query => query.isLoading)
  const isSuccess = useUserQueries().every(query => query.isSuccess)
  const isError = useUserQueries().some(query => query.isError)
  
  const { monthName: currMonth } = getCurrentDate()

  const { date: activeDate, week: activeWeek, month: activeMonth, year: activeYear } = useActiveDate()

  const activeMonthName = getMonth(activeMonth + 1)
  
  const { date: currDateIsActive, week: currWeekIsActive, month: currMonthIsActive, year: currYearIsActive } = useCurrentIsActive()

  const handleClickTask = (care: Care) => {
    setClickedCare(care)
    setModalVisible(true)
  }

  const EmptyList  = () => (
    <Text style={styles.empty}>No tasks to manage.</Text>
  )

  useEffect(() => {
    if (isSuccess) {
      setPets(pets.data)
    }
  }, [pets.data, cares.data])

  return (  
    <View style={styles.container}>
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching data... </Text> }
      { isSuccess && 
        <>        
          <View style={styles.iconMenuContainer}>
            <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
              <Text style={styles.taskCount}>{cares.data['Daily']?.length ?? 0}</Text>
              <Image source={require('@assets/icons/day.png')} style={styles.icon } />
              <Text style={[styles.iconText, selected === 'day' && styles.selected]}>{ 
                currDateIsActive && currMonthIsActive ? 'Today' 
                : currMonthIsActive ? `${currMonth} ${activeDate + 1}`
                : `${activeMonthName} ${activeDate + 1}`
              }</Text>
          
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
              <FlatList
                data={cares.data['Daily']}
                extraData={cares.data['Daily']}
                keyExtractor={(item, index) => item + index.toString()}
                renderItem={({ item }) => 
                  <SwipeableTask key={item._id} care={item} navigation={navigation}
                    onPress={() => handleClickTask(item)}
                  />
                }
                ListEmptyComponent={<EmptyList />}
              />
            }
            
            {selected === 'week' && 
              <FlatList
                data={cares.data['Weekly']}
                extraData={cares.data['Weekly']}
                keyExtractor={(item, index) => item + index.toString()}
                renderItem={({ item }) => 
                  <SwipeableTask key={item._id} care={item} navigation={navigation}
                    onPress={() => handleClickTask(item)}
                  />
                }
                ListEmptyComponent={<EmptyList />}
              />
            }

            {selected === 'month' && 
              <FlatList
                data={cares.data['Monthly']}
                extraData={cares.data['Monthly']}
                keyExtractor={(item, index) => item + index.toString()}
                renderItem={({ item }) => 
                  <SwipeableTask key={item._id} care={item} navigation={navigation}
                    onPress={() => handleClickTask(item)}
                  />
                }
                ListEmptyComponent={<EmptyList />}
              />
            }

            {selected === 'year' && 
              <FlatList
                data={cares.data['Yearly']}
                extraData={cares.data['Yearly']}
                keyExtractor={(item, index) => item + index.toString()}
                renderItem={({ item }) => 
                  <SwipeableTask key={item._id} care={item} navigation={navigation}
                    onPress={() => handleClickTask(item)}
                  />
                }
                ListEmptyComponent={<EmptyList />}
              />
            }
          </View>
        </>
      }

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => setClickedCare({})}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={styles.modalContainer}> 
          <View style={styles.detailContainer}>
            <CloseButton onPress={() => setModalVisible(false)} />
            <CareCard care={clickedCare} navigation={navigation} onNavigate={() => setModalVisible(false)}/>
          </View>
        </Pressable>
      </Modal> 
      

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '75%',
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
    height: '5%',
    marginTop: 25,
    marginBottom: 15,
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
    height: '95%',
    marginTop: 10,
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
    ...Spacing.fullWH,
    ...Spacing.centered,
    position: 'relative',
    backgroundColor: Colors.lightestPink,
  },
  detailContainer: {
    width: '100%',
    height: '60%',
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