//npm
import React, { FC, useState } from 'react'
import { Image, StyleSheet, Text, View, TextInput } from 'react-native'
//helpers
import { getActionIconSource } from '@utils/ui'
//styles
import { Colors, UI, Spacing } from '@styles/index'
import { Icon } from '@components/UIComponents'

interface NoteFormProps {
  onAddNote: (notes: string) => void
}

const NoteForm = ({ onAddNote }: NoteFormProps) => {
  const [notes, setNotes] = useState<string>(null)

  const onEdit = (text: string) => {
    onAddNote(text)
    setNotes(text)
  }
  return (
    <View style={styles.container}>
      <View style={styles.iconCon}>
        <Icon name='noteColor' size='med' />
      </View>
      <TextInput
        style={styles.input}
        value={notes}
        placeholder="Enter notes (optional)"
        placeholderTextColor={Colors.shadow.reg}
        multiline
        onChangeText={(text: string) => onEdit(text)}
      />
    </View>
  )
}

export default NoteForm

const styles = StyleSheet.create({
  container: {
    width: '70%',
    height: 70,
    borderWidth: 2,
    borderColor: Colors.shadow.reg,
    borderRadius: 8,
    padding: 10,
    marginTop: 100,
  },
  input: {
    ...Spacing.fullWH,
  },
  icon: {
    ...UI.icon(),
  },
  iconCon: {
    position: 'absolute',
    top: -25,
    right: -25,
    padding: 5,
    backgroundColor: Colors.shadow.lightest,
  }
})