//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Modal, TouchableWithoutFeedback, Pressable } from "react-native"
import Swipeable from 'react-native-gesture-handler/Swipeable'
//context
import { useCareContext } from "../context/CareContext"
//utils & services
import { Care } from "../services/careService"
import * as careUtils from '../utils/careUtils'
//components
import CareCard from "./CareComponents/CareCard"
import TaskItem from "./TaskItem"
import { AddButton, CloseButton } from "./ButtonComponent"
//styles
import { Buttons, Spacing, Forms, Colors } from '../styles'
import FloatingButton from "./FloatingButton/FloatingButton"

interface CareFeedProps {
  navigation: any
}

const CareFeed: React.FC<CareFeedProps> = ({ navigation }) => {
  const {careCards } = useCareContext()
  const sortedCareCards: {[key: string]: Care[]} = careCards.length ? careUtils.sortByFrequency(careCards) : {}

  const [selected, setSelected] = useState<string>('day')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedTask, setClickedTask] = useState<Care>({})

  const handleClickTask = (task: Care) => {
    setClickedTask(task)
    setModalVisible(true)
  }

  const EmptyList  = () => (
    <View>
      <Text>No tasks.</Text>
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
            extraData={sortedCareCards['Daily']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item }) => 
              <TaskItem key={item._id} task={item} navigation={navigation} 
                onPress={() => handleClickTask(item)}
              />
            }
            ListEmptyComponent={<EmptyList />}
          />
        }
        
        {selected === 'week' && 
          <FlatList
            data={sortedCareCards['Weekly']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item }) => 
              <TaskItem key={item._id} task={item} navigation={navigation} 
                onPress={() => handleClickTask(item)}
              />
            }
          />
        }

        {selected === 'month' && 
          <FlatList
            data={sortedCareCards['Monthly']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item }) => 
              <TaskItem key={item._id} task={item} navigation={navigation} 
                onPress={() => handleClickTask(item)}
              />
            }
          />
        }

        {selected === 'year' && 
          <FlatList
            data={sortedCareCards['Yearly']}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item }) => 
              <TaskItem key={item._id} task={item} navigation={navigation} 
                onPress={() => handleClickTask(item)}
              />
            }
            ListEmptyComponent={<EmptyList />}
          />
        }
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => setClickedTask({})}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={styles.modalContainer}> 
          <View style={styles.detailContainer}>
            <CloseButton onPress={() => setModalVisible(false)} />
            <CareCard care={clickedTask} navigation={navigation} onNavigate={() => setModalVisible(false)}/>
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
    top: '15%',
  },
  selected: {
    color: Colors.red,
    fontWeight: 'bold',
  },
  taskListContainer : {
    width: '90%',
    height: '95%',
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
})
 
export default CareFeed