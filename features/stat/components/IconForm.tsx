import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
//helpers
import { statValueIconSource } from "@utils/ui"
import { STATS, STAT_QUAL_VALUES } from "../statHelpers"
//components
import NoteForm from "./NoteForm"
import { AnimatedButton } from "@components/ButtonComponents"
import { FormHeader, Icon } from "@components/UIComponents"
//styles
import { Colors, Spacing } from "@styles/index"

interface LogFormProps {
  name: string
  initialValues?: { name: string, value: number, date: string, notes: string }
  onSelect: (item: { name: string, value: number, notes: string }) => void
}

const IconForm = ({ name, initialValues, onSelect }: LogFormProps) => {
  const [value, setValue] = useState<number>(initialValues?.value ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)
  
  const options = [...Object.keys(statValueIconSource[name])].reverse()

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
      {initialValues?.date && 
        <Text>{new Date(initialValues.date).toLocaleString()}</Text>
      }
      <View style={styles.optionCon}>
        { options.map(option => {
          const index = Number(option)
          const isSelected = value === index

          return (
            <View style={styles.buttonCon} key={index}>
              <AnimatedButton scaleFactor={1.2} index={Number(option)} onPress={handlePress}>
                <Icon type='statValue' name={name} value={index} size="xLarge" />
              </AnimatedButton>
              <Text style={{ color: isSelected ? Colors.black : Colors.shadow.dark }}>{STAT_QUAL_VALUES[index]}</Text>

              {isSelected &&
                <Animated.View style={[animatedCheckStyles, styles.selected]}>
                  <Icon name='checkColor' />
                </Animated.View>
              }
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
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selected: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: -5,
  },
  buttonCon: {
    ...Spacing.flexColumn,
    margin: 10,
  },
})

export default IconForm