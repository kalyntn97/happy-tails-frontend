import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
//styles
import { Colors, Spacing, UI, Typography } from '@styles/index'
import { BottomModal } from '../UIComponents'
import { ViewStyle } from 'react-native'

type Props = {
  mode?: 'modal'
  onPress: (colorIndex: number) => void
  selected: number
  buttonWidth?: number
  pickerStyles?: ViewStyle
}

const ColorPicker = ({ onPress, selected = 0, mode, buttonWidth = 45, pickerStyles }: Props) => {
  const [modalVisible, setModalVisible] = useState(false)

  const buttonStyles = useCallback((index: number) => ({ ...styles.circle, width: buttonWidth, height: buttonWidth, backgroundColor: Colors.multi.light[index] }), [buttonWidth])
  const containerStyles = useMemo(() => [pickerStyles, styles.container, { maxWidth: buttonWidth <= 30 ? buttonWidth * 12 : buttonWidth * 5 }], [buttonWidth])

  let colorOptions = []
  for (let i = 0; i < Colors.multi.light.length; i++) {
    colorOptions.push(
      <TouchableOpacity 
        key={i}
        style={[buttonStyles(i), { margin: buttonWidth <= 30 ? 7 : 10 }]}
        onPress={() => onPress(i)}
      >
        { selected === i && <Text style={{ fontSize: buttonWidth <= 30 ? 12 : 18 }}>✔︎</Text> }
      </TouchableOpacity>
    )
  }

  return (
    <>
      { mode === 'modal' ?
        <View>
          <Pressable style={buttonStyles(selected)} onPress={() => setModalVisible(!modalVisible)} />
          <BottomModal modalVisible={modalVisible} height='30%' onDismiss={() => setModalVisible(false)} overlay='transparent'>
            <View style={containerStyles}>{colorOptions}</View>
          </BottomModal>
        </View>
      : <View style={containerStyles}>{colorOptions}</View> }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
  },
  circle: {
    ...Spacing.centered,
    borderRadius: 99,
    borderWidth: 3,
    borderColor: Colors.transparent.semiLight,
  },
})
export default ColorPicker