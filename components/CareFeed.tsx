//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList } from "react-native"
import Swipeable from 'react-native-gesture-handler/Swipeable'
//context
import { useCareContext } from "../context/CareContext"
//utils & services
import { Care } from "../services/careService"
import * as careUtils from '../utils/careUtils'
import { getTaskStatus } from "../utils/careUtils"
//components
import ScrollPetList from "./ScrollPetList"
import { AddButton } from "../styles/buttonComponent"
import { SquareButton } from "../styles/buttonComponent"
//styles
import { Buttons, Spacing, Forms, Colors } from '../styles'

interface CareFeedProps {
  today: { currDate: number, currMonth: string, monthIdx: number, currYear: number, currWeek: number }
  navigation: any
  careCards: Care[]
}

const CareFeed: React.FC<CareFeedProps> = ({ today, navigation, careCards }) => {
  const [selected, setSelected] = useState<string>('day')


  const sortedCareCards: { [key: string]: Care[] } = careCards.reduce((result, careCard) => {
    const { frequency } = careCard
    result[frequency] = result[frequency] || []
    result[frequency].push(careCard)
    return result
  }, {})

  const TaskItem = ({ task, index }) => {
    const done = careUtils.getTaskStatus(task.frequency, today)

    const rightSwipeActions = () => (
      <View style={styles.squareBtnContainer}>
        <SquareButton title='Edit' onPress={() => navigation.navigate('Care', { screen: 'Edit', params: { care: task } })} />
        <SquareButton title='More' onPress={() => navigation.navigate('Care', { screen: 'Details', params: { careId: task._id } })} />
      </View>
    )
  
    return (
      <Swipeable
        renderRightActions={() => rightSwipeActions()}
      >
        <TouchableOpacity 
          key={task._id}
          style={[
            styles.task, 
            { backgroundColor: careUtils.getTaskBackgroundColor(task.frequency) }
          ]} 
          onPress={() => navigation.navigate('Care', { 
            screen: 'Index', params: {sectionIndex: 0, itemIndex: index } 
          })}
        >
          <Text style={[
            done === task.times && styles.done, 
            styles.taskText
          ]}>
            {task.name}
          </Text>
          <Text>{done}/{task.times}</Text>
          <ScrollPetList petArray={task.pets} size='mini' />
        </TouchableOpacity>
      </Swipeable>
    )
  }

  const ManageTaskButton = () => (
    <TouchableOpacity style={styles.mainBtn} 
      onPress={() => navigation.navigate('Care', { 
        screen: 'Index', 
        params: { 
          sectionIndex: 
            selected === 'day' ? 0 : selected === 'week' ? 1 : selected === 'month' ? 2 : 3,
          itemIndex: 0 
        } 
    })}>
      <Text style={styles.btnText}>Manage Tasks</Text>
    </TouchableOpacity>
  )
  
  const EmptyList  = () => (
    <View>
      <Text>Nothing yet to manage.</Text>
    </View>
  )
    
  return (  
    <View style={styles.container}>
      <View style={styles.iconMenuContainer}>
        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
          <Text style={styles.taskCount}>{sortedCareCards['Daily']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/day.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'day' && styles.selected]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
          <Text style={styles.taskCount}>{sortedCareCards['Weekly']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/week.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'week' && styles.selected]}>This Week</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
          <Text style={styles.taskCount}>{sortedCareCards['Monthly']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/month.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'month' && styles.selected]}>This Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
          <Text style={styles.taskCount}>{sortedCareCards['Yearly']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/year.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'year' && styles.selected]}>This Year</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.taskListContainer}>
        {selected === 'day' && 
          <FlatList
            data={sortedCareCards['Daily']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item, index }) => 
              <TaskItem key={`d-${index}`} task={item} index={index} />
            }
            ListFooterComponent={<ManageTaskButton />}
            ListEmptyComponent={<EmptyList />}
          />
        }
        
        {selected === 'week' && 
          <FlatList
            data={sortedCareCards['Weekly']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item, index }) => 
              <TaskItem key={`w-${index}`} task={item} index={index} />
            }
          />
        }

        {selected === 'month' && 
          <FlatList
            data={sortedCareCards['Monthly']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item, index }) => 
              <TaskItem key={`m-${index}`} task={item} index={index} />
            }
          />
        }

        {selected === 'year' && 
          <FlatList
            data={sortedCareCards['Yearly']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item, index }) => 
              <TaskItem key={`y-${index}`} task={item} index={index} />
            }
            ListEmptyComponent={<EmptyList />}
          />
        }
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  iconMenuContainer: {
    ...Spacing.flexRow,
    width: '100%',
    height: '5%',
    marginVertical: 10
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
    bottom: '25%',
  },
  selected: {
    color: Colors.red,
    fontWeight: 'bold',
  },
  taskListContainer : {
    width: '90%',
    height: '95%',
  },
  task: {
    ...Spacing.flexRow,
    width: '100%',
    height: 60,
    justifyContent: 'space-around',
    borderRadius: 15,
    marginVertical: 5
  },
  taskText: {
    fontSize: 15,
    fontWeight: 'bold',
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
  squareBtnContainer: {
    ...Spacing.flexRow,
    height: 70,
    marginLeft: 10

  },
})
 
export default CareFeed