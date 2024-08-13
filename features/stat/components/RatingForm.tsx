//npm
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
//helpers
import { STATS, STAT_QUAL_VALUES } from '../statHelpers'
import { getStatQualIconSource } from '@utils/ui'
//styles
import { Colors, Spacing, Typography, UI, Buttons } from '@styles/index'
import NoteForm from './NoteForm'

interface RatingFormProps {
  name: string
  initialValues?: { name: string, value: number, notes: string, date: string }
  onSelect: (item: { name: string, value: number, notes: string }) => void
}

const RatingForm: FC<RatingFormProps> = ({ name, initialValues, onSelect }) => {
  const [value, setValue] = useState<number>(initialValues?.value ?? null)
  const [notes, setNotes] = useState<string>(initialValues?.notes ?? null)

  let optionCon = []
  for (let i = 0; i < 5; i++) {
    optionCon.push(
      <TouchableOpacity key={i} style={styles.dotCon} onPress={() => {
        value === i ? setValue(null) : setValue(i)
        onSelect({ name, value: i, notes })
      }}>
        <View style={[
          styles.dot, i === 0 || i === 4 ? styles.large : i === 2 ? styles.small : styles.medium, value === i && styles.selected
        ]}>
          { value === i && <Text style={[styles.check, { fontSize: i === 0 || i === 4 ? 25 : i === 2 ? 13 : 20 }]}>✓</Text> }
        </View>
        <Text style={[styles.label, value === i && { color: Colors.shadow.darkest }]}>{STAT_QUAL_VALUES[i]}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...Typography.mediumHeader }}>{STATS[name].name}</Text>
      <View style={styles.iconCon}>
        <Image source={getStatQualIconSource(name, 0)} style={{ ...UI.largeIcon }} />
        <Image source={getStatQualIconSource(name, 1)} style={{ ...UI.largeIcon }} />
      </View>
      <View style={styles.optionCon}>{ optionCon }</View>

      <NoteForm onAddNote={setNotes} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    ...Spacing.fullCon(),
    ...Spacing.centered,
  },
  optionCon: {
    width: '100%',
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dotCon: {
    width: 70,
    height: 60,
    ...Spacing.centered,
  },
  dot: {
    borderRadius: 99,
    borderColor: Colors.pink.reg,
    borderWidth: 2,
    ...Spacing.centered,
  },
  selected: {
    backgroundColor: Colors.pink.reg,
  },
  large: {
    width: 50,
    height: 50,
  },
  small: {
    width: 20,
    height: 20,
  },
  medium: {
    width: 35,
    height: 35,
  },
  label: {
    position: 'absolute',
    bottom: -20,
    color: Colors.shadow.reg
  },
  iconCon: {
    ...Spacing.flexRow,
    width: '90%',
    justifyContent: 'space-between',
    margin: 20
  },
  check: {
    color: Colors.white,
    fontWeight: 'bold',
  }, 
})

export default RatingForm