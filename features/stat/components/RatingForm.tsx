import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
//helpers
import { STATS, STAT_QUAL_VALUES } from '../statHelpers'
//components
import { AnimatedButton } from '@components/ButtonComponents'
import { FormHeader, Icon } from '@components/UIComponents'
import NoteForm from './NoteForm'
//styles
import { Colors, Spacing } from '@styles/index'

interface RatingFormProps {
  name: string
  initialValues?: { name: string, value: number, notes: string, date: string }
  onSelect: (item: { name: string, value: number, notes: string }) => void
}

const dotWidths = [50, 35, 25, 35, 50]
const checkSizes = [25, 20, 13, 20, 25]
const colors = [Colors.red.dark, Colors.red.reg, Colors.shadow.reg, Colors.green.reg, Colors.green.dark]

const RatingForm = ({ name, initialValues, onSelect }: RatingFormProps) => {
  const [value, setValue] = useState<number>(initialValues?.value ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)

  const opacity = useSharedValue<number>(0)

  const animatedCheckStyles = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const handlePress = (index: number) => {
    opacity.value = withTiming(1, { duration: 500 })
    const newValue = value === index ? null : index
    setValue(newValue)
    if (newValue >= 0) onSelect({ name, value: newValue, notes })
  }

  return (
    <View style={Spacing.fullCon('col', true)}>
      <FormHeader title={STATS[name].name} size="large" />

      <View style={styles.optionCon}>
        <Icon type='statValue' name={name} value={0} size="xLarge" />
        <Icon type='statValue' name={name} value={1} size="xLarge" />
      </View>

      <View style={styles.optionCon}>
        { [...Array(5)].map((_, index) => {
          const dotWidth = dotWidths[index]
          const checkSize = checkSizes[index]
          const isSelected = value === index
          return (
            <View key={index} style={styles.dotCon}>
              <AnimatedButton index={index} scaleFactor={0.8} onPress={handlePress}>
                <View style={[styles.dot, { width: dotWidth, height: dotWidth, borderColor: colors[index] }, isSelected && { backgroundColor: colors[index] }]}>
                  { isSelected && 
                    <Animated.Text style={[animatedCheckStyles, styles.check, { fontSize: checkSize }]}>✓</Animated.Text> 
                  }
                </View>
              </AnimatedButton>
              <Text style={[, { color: isSelected ? colors[index] : Colors.shadow.dark }]}>{STAT_QUAL_VALUES[index]}</Text>
            </View>
          )
        })}
      </View>

      <NoteForm onAddNote={(text: string) => {
        setNotes(text)
        if (text) onSelect({ name, value, notes: text })
      }} />
    </View>
  )
}


const styles = StyleSheet.create({
  optionCon: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between',
  },
  dotCon: {
    ...Spacing.flexColumn,
    height: dotWidths[0] + 30,
    justifyContent: 'space-around',
  },
  dot: {
    ...Spacing.centered,
    borderRadius: 99,
    borderWidth: 2,
  },
  check: {
    color: Colors.white,
    fontWeight: 'bold',
  }, 
})

export default RatingForm