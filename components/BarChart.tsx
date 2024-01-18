//npm
import { StyleSheet, Text, View, useWindowDimensions } from "react-native"
//services & utils
import { Tracker } from "../services/careService"
import * as careUtils from '../utils/careUtils'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface BarChartProps {
  tracker: any
  frequency: string
  times: number
}

const BarChart: React.FC<BarChartProps> = ({ tracker, frequency, times }) => {

  const { month, year, currMonth, isCurrent } = careUtils.getDateTimeFromTracker(tracker.name)
  const { week: currWeek } = careUtils.getCurrentDate()

  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const chartWidth = windowWidth * 0.9
  const chartHeight = windowHeight * 0.35
  const barWidth = frequency === 'Weekly' ? chartWidth * 0.25 / times : chartWidth * 0.25 / 12
  const barHeightUnit = chartHeight * 0.7 / times

  const colorArray = careUtils.getColorArray()

  return (  
    <View style={[styles.container, { width: chartWidth, height: chartHeight }]}>
      <View style={[styles.chartName, {  }]}>
      <View style={[styles.header, { height: '30%' }]}>
          <Text style={[
            styles.headerText,
            { color: isCurrent ? Colors.darkPink : 'black' },
            frequency === 'Weekly' 
            ? { fontSize: 15, width: chartHeight * 0.3 }
            : { fontSize: 30, width: chartHeight}
          ]}>
            {year}
          </Text>
        </View>
        <View style={[styles.header, { height: '70%' }]}>
          <Text style={[
            styles.headerText,
            { color: isCurrent ? Colors.darkPink : 'black' },
            { fontSize: 20, width: chartHeight * 0.7 }
          ]}>
            {month}
          </Text>
        </View>
      </View>

      <View style={styles.chart}>
        {tracker.done.map((value, idx) =>
          <View key={idx}
            style={[
              styles.column, {
                width: barWidth,
                height: barHeightUnit * value ,
                backgroundColor: careUtils.getColor(times, value, colorArray),
                marginHorizontal: frequency === 'Weekly' ? 10 : 7
              }
            ]}
          > 
            <Text style={[styles.label, 
              { width: barHeightUnit }, 
              frequency === 'Monthly' ? { bottom: -60, left: -80 } : { bottom: -50, left: -45 },
              ( 
                (currWeek === idx + 1 && isCurrent && frequency === 'Weekly') 
                || (currMonth === idx + 1 && isCurrent && frequency === 'Monthly') 
              ) ? { color: Colors.darkPink, fontWeight: 'bold' } 
              : {}
            ]}>
                {frequency === 'Weekly' 
                  ? `Week ${idx + 1}`
                  : careUtils.getMonth(idx + 1).slice(0, 3)
                }
            </Text>
           
            <Text style={[
              styles.value, 
              { fontSize: frequency === 'Weekly' ? 15 : 10 }
            ]}>
              {value}
            </Text>
          </View>
        )}
      </View>
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    backgroundColor: 'white',
    marginVertical: 20,
    ...Forms.boxShadow,
    borderRadius: 8
  },
  chartName: {
    width: '15%',
    height: '100%',
    ...Spacing.flexColumn,
  },

header: {
  width: '100%',
  ...Spacing.centered,
},
  headerText: {
    transform: [{ rotate: '270deg'}],
    fontWeight: 'bold',
    textAlign: 'center'
  },
  chart: {
    width: '85%',
    height: '80%',
    ...Spacing.flexRow,
    alignItems: 'flex-end',
  },
  column: {
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  value: {
    position: 'absolute',
    top: -20,
    fontWeight: 'bold'
  },
  label: {
    transform: [{ rotate: '315deg'}],
    position: 'absolute',
    textAlign: 'right'
  }
})

export default BarChart