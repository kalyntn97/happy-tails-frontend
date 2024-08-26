//npm
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import * as Progress from 'react-native-progress'
//types & helpers
import { Care } from "@care/CareInterface"
import { convertToTimeString, getCurrentTimeString, getLocaleDateString } from "@utils/datetime"
//components
import { ActionButton } from "@components/ButtonComponents"
import { Icon, NoteInput } from "@components/UIComponents"
//store & hooks
import { useCreateLog, useDeleteLog, useUpdateLog } from "@care/careQueries"
import { useFullActiveDate } from "@store/store"
//styles
import TimePicker, { Time } from "@components/Pickers/TimePicker"
import { Colors, Spacing } from '@styles/index'

const ProgressTracker = ({ care }: { care: Care }) => {
  const currentTime = getCurrentTimeString().time
  
  const [notes, setNotes] = useState(null)
  const [time, setTime] = useState<Time>(currentTime)
  const createLogMutation = useCreateLog()
  const updateLogMutation = useUpdateLog()
  const deleteLogMutation = useDeleteLog()

  const color = Colors.multi.darkest[care.color]
  const activeDate: Date = useFullActiveDate()

  const log = care.logs.find(log => getLocaleDateString(log.date) === activeDate.toLocaleDateString())
  const shouldIncrement = care.frequency.type === 'days' && care.frequency.timesPerInterval[0] > 1 && log

  const progress = log ? 
    Number((log.value / (shouldIncrement ? care.frequency.timesPerInterval[0] : 1)).toFixed(2))
    : 0
  
  const advanceProgress = () => {
    shouldIncrement ? updateLogMutation.mutate({ ...log, value: log.value + 1, notes: [...log.notes, { value: notes, time: convertToTimeString(time) }], logId: log._id })
      : createLogMutation.mutate({ date: activeDate.toISOString(), notes: [{ value: notes, time: convertToTimeString(time) }], care: care._id, logId: null })
    setNotes(null)
  } 

  const reduceProgress = () => {
    shouldIncrement && log.value > 1 ? updateLogMutation.mutate({ ...log, value: log.value - 1, notes: log.notes.slice(0, -1), logId: log._id })
      : deleteLogMutation.mutate({ logId: log._id, careId: care._id })
  }
  return (
    <View style={Spacing.flexColumnStretch}>
      <View style={styles.countBox}>
        <ActionButton icon='decrease' buttonStyles={{ marginHorizontal: 15 }} onPress={reduceProgress} />

        <Progress.Circle progress={progress} showsText={true} formatText={() => `${progress * 100}%`} color={color} size={100} thickness={5} borderWidth={2} borderColor={color} />

        <NoteInput overlay={Colors.white} customLabel={<Icon name='increase' />} buttonStyles={{ marginHorizontal: 15 }} notes={notes} onChange={setNotes} header="Add Notes (optional)" maxLength={50} onSubmit={advanceProgress} subHeading={<TimePicker time={time} onSelect={(time: Time) => setTime(time)} />} />
      </View>

      { log && log.notes.map((note, index) =>
        <View key={index} style={Spacing.flexRow}>
          <Text>{note.time}: </Text>
          <Text>{note.value}</Text> 
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  countBox: {
    ...Spacing.flexRow,
    marginVertical: 15,
  },
})

export default ProgressTracker