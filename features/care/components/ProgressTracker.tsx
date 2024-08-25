//npm
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import * as Progress from 'react-native-progress'
//types & helpers
import { Care } from "@care/CareInterface"
import { getLocaleDateString } from "@utils/datetime"
//components
import { ActionButton } from "@components/ButtonComponents"
import { Icon, NoteInput } from "@components/UIComponents"
//store & hooks
import { useCreateLog, useDeleteLog, useUpdateLog } from "@care/careQueries"
import { useFullActiveDate } from "@store/store"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'

const ProgressTracker = ({ care }: { care: Care }) => {
  const [notes, setNotes] = useState(null)

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
  
  const incrementProgress = () => {
    shouldIncrement ? updateLogMutation.mutate({ ...log, value: log.value + 1, notes: [...log.notes, notes], logId: log._id })
      : createLogMutation.mutate({ date: activeDate.toISOString(), notes: [notes], care: care._id, logId: null })
  }

  const decrementProgress = () => {
    shouldIncrement && log.value > 1 ? updateLogMutation.mutate({ ...log, value: log.value - 1, notes, logId: log._id })
      : deleteLogMutation.mutate({ logId: log._id, careId: care._id })
  }

  return (
    <View style={Spacing.flexColumnStretch}>
      <View style={styles.countBox}>
        <ActionButton icon='decrease' buttonStyles={{ marginHorizontal: 15 }} onPress={decrementProgress} />

        <Progress.Circle progress={progress} showsText={true} formatText={() => `${progress * 100}%`} color={color} size={100} thickness={5} borderWidth={2} borderColor={color} />

        <NoteInput customLabel={<Icon name='increase' />} buttonStyles={{ marginHorizontal: 15 }} notes={notes} onChange={setNotes} header="Add Notes (optional)" maxLength={50} onSubmit={incrementProgress} />
      </View>
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