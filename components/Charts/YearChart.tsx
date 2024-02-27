//npm
import { StyleSheet, Text, View } from "react-native"
//components
import ProgressTracker from "./ProgressTracker"
//services & utils
import * as careUtils from "../../utils/careUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface YearChartProps {
  tracker: any
  times: number
}

const YearChart: React.FC<YearChartProps> = ({ tracker, times }) => {
  const { isCurrent } = careUtils.getDateTimeFromTracker(tracker.name)
  const { year: currYear } = careUtils.getCurrentDate()
  return (  
    <View style={styles.container}>
      <Text style={[styles.header,isCurrent ? { color: Colors.darkPink } : {}]}>{currYear}</Text>
      <ProgressTracker times={times} done={tracker.done[0]} size={times > 6 ? 'small' : 'large'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    ...Spacing.flexRow,
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