import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useRef } from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import { IconButton } from './ButtonComponent'
import { Spacing } from '@styles/index'
import { getActionIconSource } from '@utils/ui'

type Props = {
  swipeRightActions?: { [action: string]: () => void }
  swipeLeftActions?: { [action: string]: () => void }
  onPress?: () => void, 
  onLongPress?: () => void
  toggle?: { onToggle: () => void, initial: boolean }
  content: ReactNode
  disabled?: boolean
  color: string, 
  
}

const SwipeableItem = ({ color, content, swipeRightActions, swipeLeftActions, onPress, onLongPress, toggle, disabled }: Props) => {
  const swipeableRef = useRef(null)

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }

  const rightSwipeActions = () => (
    <View style={styles.squareBtnContainer}>
      { Object.keys(swipeRightActions).map(action => 
        <IconButton key={action} type={action} size='medium' onPress={() => {
          swipeRightActions[action]()
          closeSwipeable()
        } } />
      )}
    </View>
  )

  return (
    <Swipeable ref={swipeableRef} renderRightActions={rightSwipeActions}>
      <TouchableOpacity
        style={[
          styles.task, 
          { backgroundColor: color }
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
    flex: 14,
    paddingHorizontal: 10,
  },
  squareBtnContainer: {
    ...Spacing.flexRow,
    height: 70,
    marginLeft: 10
  },
  check: {
    width: 25,
    height: 25,
  },
  bulletBtn: {
    marginRight: 15,
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