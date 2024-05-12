import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors, Spacing } from '@styles/index'

type Props = {
  onPress: (colorIndex: number) => void
  initial: number
}

const ColorPickingPanel: FC<Props> = ({ onPress, initial }) => {
  const [selected, setSelected] = useState<number>(initial ?? 0)
  
  const onSelect = (index: number) => {
    setSelected(index)
    onPress(index)
  }

  let colorOptions = []
  for (let i = 0; i < Colors.multi.light.length; i++) {
    colorOptions.push(
      <TouchableOpacity 
        key={i}
        style={[styles.circle, { backgroundColor: Colors.multi.light[i]}]}
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
    <View style={styles.container}>
      {colorOptions}
    </View>
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
    margin: 10,
    ...Spacing.centered,
  },
  check: {
    fontSize: 20,
  }
})
export default ColorPickingPanel