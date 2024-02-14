//npm
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
//services & utils
import * as careUtils from '../utils/careUtils'
//components
import { SquareButton } from './buttonComponent'
import ScrollPetList from './ScrollPetList'
//styles
import { Spacing } from '../styles'

const TaskItem = ({ task, today, navigation, onPress }) => {
 
  const done = careUtils.getTaskStatus(task, today)
  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      <SquareButton title='Edit' onPress={() => navigation.navigate('Care', { screen: 'Edit', params: { care: task } })} />
      <SquareButton title='More' onPress={() => navigation.navigate('Care', { screen: 'Details', params: { careId: task._id } })} />
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

        <TouchableOpacity style={styles.bulletBtn}>
          <Text style={styles.bulletBtnText}>{done === task.times ? '●' : '○'}</Text>
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
    flex: 1
  },
  taskPetList: {
    flex: 2
  },
  bulletBtn: {
    marginRight: 20,
  },
  bulletBtnText: {
    fontSize: 20,
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
})

export default TaskItem