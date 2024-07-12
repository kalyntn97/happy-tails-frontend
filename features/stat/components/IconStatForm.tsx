//npm
import { FC, useState } from "react"
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native"
//helpers
import { getActionIconSource, statQualIconSource } from "@utils/ui"
import { STATS, STAT_QUAL_VALUES } from "../statHelpers"
//styles
import { UI, Spacing, Typography } from "@styles/index"
import { TextInput } from "react-native-gesture-handler"
import NoteForm from "./NoteForm"

interface LogFormProps {
  name: string
  initialValues?: { name: string, value: number, date: string, notes: string }
  onSelect: (item: { name: string, value: number, notes: string }) => void
}

const IconStatForm: FC<LogFormProps> = ({ name, initialValues, onSelect }) => {
  const [value, setValue] = useState<number>(initialValues?.value ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)

  const options = statQualIconSource[name]
  
  let optionCon = []

  for (let i = options.length - 1; i >=0; i--) {
    optionCon.push(
      <TouchableOpacity key={i} style={{ ...Spacing.flexColumn, margin: 10 }} onPress={() => {
        value === i ? setValue(null) : setValue(i)
        onSelect({ name, value: i, notes })
      }}>
        <Image source={options[i]} style={{ ...UI.xLargeIcon, margin: 10 }} />
        {value === i &&
          <>
            <Image source={getActionIconSource('check')} style={styles.selected} />
            <Text style={styles.label}>{STAT_QUAL_VALUES[i]}</Text>
          </>
        }
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...Typography.mediumHeader }}>{STATS[name].name}</Text>
      {initialValues?.date && 
        <Text>{new Date(initialValues.date).toLocaleString()}</Text>
      }
      <View style={styles.optionCon}>{ optionCon }</View>

      <NoteForm onAddNote={setNotes} />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered,
  },
  optionCon: {
    width: '100%',
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  selected: {
    ...UI.smallIcon,
    position: 'absolute',
    zIndex: 1,
    top: 5,
    right: 0,
  },
  label: {
    position: 'absolute',
    bottom: -5,
  },
  input: {
    ...UI.input,
  }
})

export default IconStatForm