//npm
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
//helpers
import { statValueIconSource } from "@utils/ui"
import { STATS, STAT_QUAL_VALUES } from "../statHelpers"
//styles
import { FormHeader, Icon } from "@components/UIComponents"
import { Spacing, UI } from "@styles/index"
import NoteForm from "./NoteForm"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

interface LogFormProps {
  name: string
  initialValues?: { name: string, value: number, date: string, notes: string }
  onSelect: (item: { name: string, value: number, notes: string }) => void
}

const IconButton = ({ name, onPress, index }) => {
  const scale = useSharedValue<number>(1)

  const animatedBtnStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value}],
  }))

  const tap = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(1.2)
    })
    .onFinalize(() => {
      scale.value = withSpring(1)
      runOnJS(onPress)(index)
    })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedBtnStyles}>
        <Icon type='statValue' name={name} value={index} size="xLarge" />
      </Animated.View> 
    </GestureDetector>
  )
}

const IconStatForm = ({ name, initialValues, onSelect }: LogFormProps) => {
  const [value, setValue] = useState<number>(initialValues?.value ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)
  
  const options = statValueIconSource[name]

  const opacity = useSharedValue<number>(0)

  const animatedCheckStyles = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const handlePress = (index: number) => {
    opacity.value = withTiming(1, { duration: 300 })
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
        { options.map((_, index: number) =>
          <View style={styles.buttonCon}>
            <IconButton name={name} index={index} onPress={handlePress} />
            <Text>{STAT_QUAL_VALUES[index]}</Text>

            {value === index &&
              <Animated.View style={[animatedCheckStyles, styles.selected]}>
                <Icon name='checkColor' />
              </Animated.View>
            }
          </View>
        )}
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

export default IconStatForm