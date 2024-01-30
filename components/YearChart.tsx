//npm
import { StyleSheet, Text, View } from "react-native"
//components
import ProgressTracker from "./ProgressTracker"
//services & utils
import { Tracker } from "../services/careService"
import { getDateTimeFromTracker } from "../utils/careUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface YearChartProps {
  tracker: any
  times: number
}

const YearChart: React.FC<YearChartProps> = ({ tracker, times }) => {
  const { year, isCurrent } = getDateTimeFromTracker(tracker.name)

  return (  
    <View style={[styles.container, isCurrent ? { borderColor: Colors.darkPink } : {}]}>
      <Text style={[styles.header,isCurrent ? { color: Colors.darkPink } : {}]}>{year}</Text>
      <ProgressTracker times={times} done={tracker.done[0]} size={times > 6 ? 'small' : 'large'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    ...Spacing.flexRow,
    borderWidth: 3,
    padding: 10,
    margin: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    ...Forms.boxShadow
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    width: '30%',
    marginRight: 'auto'
  }
})

export default YearChart