import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useRef } from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import { IconButton } from './ButtonComponents'
import { Colors, Spacing } from '@styles/index'
import { getActionIconSource } from '@utils/ui'

type Props = {
  swipeRightActions?: { [action: string]: () => void }
  swipeLeftActions?: { [action: string]: () => void }
  onPress?: () => void, 
  onLongPress?: () => void
  toggle?: { onToggle: () => void, initial: boolean }
  title: string
  content: ReactNode
  disabled?: boolean
  color: string, 
  
}

const MIN_TASK_HEIGHT = 60
const MAX_TASK_HEIGHT = 70

const SwipeableItem = ({ color, title, content, swipeRightActions, swipeLeftActions, onPress, onLongPress, toggle, disabled }: Props) => {
  const swipeableRef = useRef(null)

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }

  const iconButtonStyles = {
    'edit': { icon: 'edit', bgColor: Colors.yellow.light },
    'delete': { icon: 'deleteColor', bgColor: Colors.red.light },
    'details': { icon: 'details', bgColor: Colors.green.light },
  }

  const rightSwipeActions = () => (
    <View style={[styles.squareBtnContainer, { height: TASK_HEIGHT }]}>
      { Object.keys(swipeRightActions).map(action => 
        <IconButton key={action} title={action} icon={iconButtonStyles[action].icon} type='action' size='medium' styles={{ backgroundColor: iconButtonStyles[action].bgColor, height: TASK_HEIGHT }} onPress={() => {
          swipeRightActions[action]()
          closeSwipeable()
        } } />
      )}
    </View>
  )

  const TASK_HEIGHT = title.length < 30 ? MIN_TASK_HEIGHT : MAX_TASK_HEIGHT

  return (
    <Swipeable ref={swipeableRef} renderRightActions={rightSwipeActions}>
      <TouchableOpacity
        style={[
          styles.task, 
          { backgroundColor: color, height: TASK_HEIGHT }
        ]} 
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
      >
        <View style={styles.taskContent}>{content}</View>

        { toggle && 
          <TouchableOpacity style={styles.bulletBtn} onPress={toggle.onToggle}>
          { toggle.initial ? <Image source={getActionIconSource('check')} style={styles.check} />
            : <Text style={styles.bulletBtnText}>○</Text> 
          }
          </TouchableOpacity> 
        }
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  task: {
    ...Spacing.flexRowStretch,
    borderRadius: 15,
    marginVertical: 5,
    justifyContent: 'space-between'
  },
  taskContent: {
    ...Spacing.flexRow,
    justifyContent: 'space-around',
    flex: 14,
    paddingHorizontal: 10,
  },
  squareBtnContainer: {
    ...Spacing.flexRow,
    marginVertical: 5,
    marginLeft: 10
  },
  check: {
    width: 30,
    height: 30,
  },
  bulletBtn: {
    marginRight: 20,
    flex: 1,
  },
  bulletBtnText: {
    fontSize: 25,
    fontWeight: '100'
  },
  done: {
    textDecorationLine: 'line-through',
  },
})

export default SwipeableItem