//npm
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
//services & utils
import { Care } from '../services/careService'
import * as careUtils from '../utils/careUtils'
// context
import { useCareContext } from '../context/CareContext'
//components
import { SquareButton } from './ButtonComponent'
import ScrollPetList from './ScrollPetList'
//styles
import { Spacing, Forms } from '../styles'

const TaskItem = ({ task, navigation, onPress }) => {
  const { onCheckAllDone, onUncheckAllDone} = useCareContext()
  const done = careUtils.getTaskStatus(task)

  const checkAllDone = async (task: Care) => {
    const trackerId = task.trackers[task.trackers.length - 1]._id
    const index = careUtils.getCurrentTrackerIndex(task.frequency)

    done === task.times
      ? await onUncheckAllDone!(task._id, trackerId, index)
      : await onCheckAllDone!(task._id, trackerId, index)
  }

  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      <SquareButton title='Edit' onPress={() => navigation.navigate('Care', { screen: 'Edit', params: { care: task } })} />
      <SquareButton title='Details' onPress={() => navigation.navigate('Care', { screen: 'Details', params: { care: task } })} />
      <SquareButton title='Delete' onPress={() => navigation.navigate('Care', { screen: 'Details', params: { care: task } })} />
    </View>
  )

  return (
    <Swipeable renderRightActions={() => rightSwipeActions()}>
      <TouchableOpacity 
        key={task._id}
        style={[
          styles.task, 
          { backgroundColor: careUtils.getTaskBackgroundColor(task.frequency) }
        ]} 
        onPress={onPress}
      > 
        <View style={styles.taskContent}>
          <Text style={[
            done === task.times && styles.done, 
            styles.taskText
          ]}>
            {task.name}
          </Text>
          <Text style={styles.taskStatus}>{done}/{task.times}</Text>
          <View style={styles.taskPetList}>
            <ScrollPetList petArray={task.pets} size='mini' />
          </View>
        </View>

        <TouchableOpacity style={styles.bulletBtn} onPress={() => checkAllDone(task)}>
          {done === task.times 
          ? <Image source={require('../assets/icons/check.png')} style={styles.check}/>
          : <Text style={styles.bulletBtnText}>○</Text> }
        </TouchableOpacity>

      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  task: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    marginVertical: 5,
    ...Spacing.flexRow,
    justifyContent: 'space-between'
  },
  taskContent: {
    ...Spacing.flexRow,
    justifyContent: 'space-around',
    flex: 6,
    paddingHorizontal: 10,
  },
  taskText: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 3
  },
  taskStatus: {
    flex: 1,
    fontSize: 12,
  },
  taskPetList: {
    flex: 2
  },
  bulletBtn: {
    marginRight: 20,
  },
  bulletBtnText: {
    fontSize: 25,
    fontWeight: '100'
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  squareBtnContainer: {
    ...Spacing.flexRow,
    height: 70,
    marginLeft: 10
  },
  check: {
    width: 25,
    height: 25,
  }
})

export default TaskItem