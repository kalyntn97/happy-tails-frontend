//npm
import { FC, useEffect, useState } from "react"
import {  TextInput, TouchableOpacity, Image, Text, View } from "react-native"
//components
import { IconButton } from "@components/ButtonComponent"
import { AlertForm, getActionIconSource } from "@utils/ui"
//types & queries
import { Visit } from "@health/HealthInterface"
import { useAddVisitNotes } from "@health/healthQueries"
//styles
import { styles } from "@styles/stylesheets/DetailsScreenStyles"
import Colors from "@styles/colors"

interface NoteInputProps {
  healthId: string
  visit: Visit
  due?: boolean
}

const NoteInput: FC<NoteInputProps> = ({ healthId, visit, due }) => {
  const [notes, setNotes] = useState<string>(visit.notes ?? null)
  const [showInput, setShowInput] = useState<boolean>(false)

  const addVisitNotesMutation = useAddVisitNotes()

  const addVisitNotes = (healthId: string, visitId: string, notes: string, due: boolean) => {
    addVisitNotesMutation.mutate({notes, due, healthId, visitId}, {
      onSuccess: () => {
        return AlertForm({ body: `Updated successfully`, button: 'OK' })
      },
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      },
    })
  }

  const onSubmit = () => {
    setShowInput(false)
    addVisitNotes(healthId, visit._id, notes, due)
  }

  const toggleShowInput = () => {
    setShowInput(!showInput)
    setNotes(visit.notes ?? null)
  }

  return (
    <TouchableOpacity onPress={() => toggleShowInput()} style={styles.noteInputCon}>
      {showInput ?
        <>
          <View style={styles.smallBtnCon}>
            <IconButton onPress={toggleShowInput} type='undo' size='small' />
            <IconButton type='delete' size='small' />
            <IconButton onPress={onSubmit} type='save' size='small' />
          </View>
          <TextInput 
            style={styles.notesInput}
            placeholder={notes || 'Enter visit notes'}
            placeholderTextColor={Colors.shadow.reg}
            value={notes}
            onChangeText={(text: string) => setNotes(text)}
          />
        </>
      : 
        <>
          <Image source={getActionIconSource('edit')} style={styles.editIcon} />
          <Text style={[styles.detailText, styles.notes, !notes && styles.emptyNote]}>{notes || 'No visit notes'}</Text>
        </>
      }
    </TouchableOpacity>
  )
}

export default NoteInput