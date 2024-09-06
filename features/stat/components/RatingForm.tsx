//npm
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
//helpers
import { STATS, STAT_QUAL_VALUES } from '../statHelpers'
import { getStatQualIconSource } from '@utils/ui'
//styles
import { Colors, Spacing, Typography, UI, Buttons } from '@styles/index'
import NoteForm from './NoteForm'
import { FormHeader, Icon } from '@components/UIComponents'
import { ScaleAnimatedButton } from '@components/ButtonComponents'
import { lightPalette } from '@styles/ui'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

interface RatingFormProps {
  name: string
  initialValues?: { name: string, value: number, notes: string, date: string }
  onSelect: (item: { name: string, value: number, notes: string }) => void
}

const dotWidths = [50, 35, 25, 35, 50]
const checkSizes = [25, 20, 13, 20, 25]
const colors = [Colors.red.dark, Colors.red.reg, Colors.shadow.reg, Colors.green.reg, Colors.green.dark]

const RatingForm: FC<RatingFormProps> = ({ name, initialValues, onSelect }) => {
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
              <ScaleAnimatedButton index={index} scaleFactor={0.8} onPress={handlePress}>
                <View style={[styles.dot, { width: dotWidth, height: dotWidth, borderColor: colors[index] }, isSelected && { backgroundColor: colors[index] }]}>
                  { isSelected && 
                    <Text style={[styles.check, { fontSize: checkSize }]}>✓</Text> 
                  }
                </View>
              </ScaleAnimatedButton>
              <Animated.Text style={[animatedCheckStyles, { color: isSelected ? colors[index] : Colors.shadow.reg }]}>{STAT_QUAL_VALUES[index]}</Animated.Text>
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