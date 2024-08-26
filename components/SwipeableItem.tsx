import React, { ReactNode, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
//components
import { IconButton } from './ButtonComponents'
import { Icon } from './UIComponents'
//styles
import { Colors, Spacing } from '@styles/index'

type Props = {
  swipeRightActions?: { icon: string, title?: string, bgColor: string, onPress: () => void }[]
  swipeLeftActions?: { icon: string, title?: string, bgColor: string, onPress: () => void }[]
  onPress?: () => void, 
  onLongPress?: () => void
  toggle?: { onToggle: () => void, isChecked: boolean }
  title: string
  content: ReactNode
  disabled?: boolean
  color: string,
  containerStyles?: ViewStyle
  
}

const MIN_TASK_HEIGHT = 60
const MAX_TASK_HEIGHT = 70

const SwipeableItem = ({ title, content, swipeRightActions, swipeLeftActions, onPress, onLongPress, toggle, disabled, color, containerStyles }: Props) => {
  const swipeableRef = useRef(null)

  const TASK_HEIGHT = title.length < 30 ? MIN_TASK_HEIGHT : MAX_TASK_HEIGHT

  const closeSwipeable = () => {
    swipeableRef.current.close()
  }
  const rightSwipeActions = () => (
    <View style={[styles.btnContainer, { height: TASK_HEIGHT }]}>
      { swipeRightActions.map(action => 
        <IconButton key={action.icon} title={action.title ?? action.icon} icon={action.icon} type='action' size='med' buttonStyles={{ height: TASK_HEIGHT, width: 60, backgroundColor: Colors[action.bgColor].light, borderWidth: 0 }} textStyles={action.title === 'delete' ? { color: Colors.red.darkest, fontWeight: 'bold' } : {}} onPress={() => {
          action.onPress()
          closeSwipeable()
        } } />
      )}
    </View>
  )


  return (
    <Swipeable ref={swipeableRef} renderRightActions={rightSwipeActions}>
      <TouchableOpacity
        style={[
          styles.item, 
          { backgroundColor: color, height: TASK_HEIGHT },
          containerStyles,
        ]} 
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
      >
        {content}

        { toggle && 
          <TouchableOpacity style={styles.bulletBtn} onPress={toggle.onToggle}>
          { toggle.isChecked ? <Icon name='checkColor' size='small' />
            : <Text style={styles.bulletBtnText}>○</Text> 
          }
          </TouchableOpacity> 
        }
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  item: {
    ...Spacing.flexRowStretch,
    ...Spacing.basePadding(15, 0),
    borderRadius: 15,
    marginVertical: 10,
  },
    btnContainer: {
    ...Spacing.flexRow,
    marginVertical: 10,
    marginLeft: 10
  },
  btn: {

  },
  check: {
    width: 30,
    height: 30,
  },
  bulletBtn: {
    ...Spacing.centered,
    width: 30,
    marginLeft: 15,
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