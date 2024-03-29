import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
import { Colors, Spacing } from '@styles/index'

type Props = {
  onPress: (colorCode: string) => void
}

const ColorPickingPanel: FC<Props> = ({ onPress }) => {
  const [selected, setSelected] = useState<string>(Colors.multiArray3[0])

  const onSelect = (index: number) => {
    setSelected(Colors.multiArray3[index])
    // onPress(Colors.multiArray3[index])
  }

  let colorOptions = []
  for (let i = 0; i < Colors.multiArray3.length; i++) {
    colorOptions.push(
      <TouchableOpacity 
        style={[styles.circle, { backgroundColor: Colors.multiArray3[i]}]}
        onPress={() => onSelect(i)}
      >
        { selected === Colors.multiArray3[i] && <Text style={styles.check}>✔︎</Text> }
      </TouchableOpacity>
    )
  }
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