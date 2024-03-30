//npm
import { FC, useEffect, useState } from "react"
import {  TextInput, TouchableOpacity, Image, Text, View } from "react-native"
//components
import { DeleteButton, SaveButton, SmallAddButton, SmallRemoveButton, UndoButton } from "@components/ButtonComponent"
import { AlertForm } from "@utils/ui"
//types & queries
import { Visit } from "@health/HealthInterface"
import { useAddVisitNotes } from "@health/healthQueries"
//styles
import { styles } from "@styles/DetailsScreenStyles"

interface NoteInputProps {
  healthId: string
  visit: Visit
}

const NoteInput: FC<NoteInputProps> = ({ healthId, visit }) => {
  const [notes, setNotes] = useState<string>(visit.notes ?? null)
  const [showInput, setShowInput] = useState<boolean>(false)

  const addVisitNotesMutation = useAddVisitNotes()

  const addVisitNotes = (healthId: string, visitId: string, notes: string) => {
    addVisitNotesMutation.mutate({notes, healthId, visitId}, {
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
    addVisitNotes(healthId, visit._id, notes)
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
              <UndoButton onPress={toggleShowInput} />
              <DeleteButton />
              <SaveButton onPress={onSubmit} />
            </View>
            <TextInput 
              style={styles.notesInput}
              placeholder={notes ?? 'Enter visit notes'}
              value={notes}
              onChangeText={(text: string) => setNotes(text)}
            />
          </>
        : 
          <>
            <Image source={require('@assets/icons/edit.png')} style={styles.miniIcon} />
            <Text style={[styles.detailText, styles.notes, !notes && styles.emptyNote]}>{notes ?? 'No visit notes'}</Text>
          </>
        }
    </TouchableOpacity>
  )
}

export default NoteInput