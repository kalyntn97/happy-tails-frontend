import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import Fuse from 'fuse.js'
//styles
import { Colors, Spacing, Forms, Typography } from '@styles/index'
import { ModalCon } from './UIComponents'

type Props = {
  mode?: 'modal'
  onPress: (colorIndex: number) => void
  initial: number
}

const ColorPicker = ({ onPress, initial, mode }: Props) => {
  const [selected, setSelected] = useState<number>(initial ?? 0)
  const [modalVisible, setModalVisible] = useState(false)
  
  const onSelect = (index: number) => {
    setSelected(index)
    onPress(index)
  }

  let colorOptions = []
  for (let i = 0; i < Colors.multi.light.length; i++) {
    colorOptions.push(
      <TouchableOpacity 
        key={i}
        style={[styles.circle, { backgroundColor: Colors.multi.light[i], margin: 10 }]}
        onPress={() => onSelect(i)}
      >
        { selected === i && <Text style={styles.check}>✔︎</Text> }
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    onSelect(initial)
  }, [initial])

  return (
    <>
      { mode === 'modal' ?
        <View>
          <Pressable style={[styles.circle, { backgroundColor: Colors.multi.light[selected] }]} onPress={() => setModalVisible(!modalVisible)} />
          <ModalCon modalVisible={modalVisible} height='30%' onDismiss={() => setModalVisible(false)}>
            <View style={styles.container}>{colorOptions}</View>
          </ModalCon>
        </View>
      : <View style={styles.container}>{colorOptions}</View> }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    width: 260,
    marginVertical: 20,
  },
  circle: {
    borderRadius: 99,
    width: 45,
    height: 45,
    ...Spacing.centered,
    borderWidth: 3,
    borderColor: Colors.transparent.semiLight,
  },
  check: {
    fontSize: 20,
  },
  modalCon: {
    ...Forms.bottomModal,
    height: '30%',
    alignItems: 'center',
  },
  subText: {
    ...Typography.xSmallBody,
    color: Colors.shadow.reg
  }
})
export default ColorPicker