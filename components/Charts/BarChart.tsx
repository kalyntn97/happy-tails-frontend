//npm
import { useEffect, useState } from "react"
import { StyleSheet, Text, View, useWindowDimensions } from "react-native"
//types & helpers
import * as careHelpers from '@care/careHelpers'
//utils
import { getDateInfo, getMonth } from "@utils/datetime"
import { getColor, getColorArray } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface BarChartProps {
  tracker: any
  frequency: string
  times: number
}

const BarChart: React.FC<BarChartProps> = ({ tracker, frequency, times }) => {
  const [barWidth, setBarWidth] = useState<number>(0)
  const [barHeightUnit, setBarHeightUnit] = useState<number>(0)

  const { trackerMonthName, trackerYear, isCurrent } = careHelpers.getTrackerInfo(tracker.name)
  const { week: currWeek, month: monthIdx } = getDateInfo(new Date())
  
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const chartWidth = windowWidth * 0.9 * 0.9
  const chartHeight = windowHeight * 0.35

  const colorArray = getColorArray()

  useEffect(() => {
    const newBarWidth = frequency === 'Weekly' ? chartWidth * 0.45 / 6 : chartWidth * 0.25 / 12
    const newBarHeightUnit = chartHeight * 0.7 / times

    setBarWidth(newBarWidth)
    setBarHeightUnit(newBarHeightUnit)
  }, [frequency, times])

  return (  
    <View style={[styles.container, { width: chartWidth, height: chartHeight }]}>
      <View style={[styles.chartName, {  }]}>
      <View style={[styles.header, { height: '30%' }]}>
          <Text style={[
            styles.headerText,
            { color: isCurrent ? Colors.pink.dark : 'black' },
            frequency === 'Weekly' 
            ? { fontSize: 15, width: chartHeight * 0.3 }
            : { fontSize: 30, width: chartHeight}
          ]}>
            {trackerYear}
          </Text>
        </View>
        <View style={[styles.header, { height: '70%' }]}>
          <Text style={[
            styles.headerText,
            { color: isCurrent ? Colors.pink.dark : 'black' },
            { fontSize: 20, width: chartHeight * 0.7 }
          ]}>
            {trackerMonthName}
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
                backgroundColor: getColor(times, value, colorArray),
                marginHorizontal: frequency === 'Weekly' ? 10 : 7
              }
            ]}
          > 
            <Text style={[
              styles.label, 
              frequency === 'Monthly' ? { bottom: -40, left: -55 } : { bottom: -50, left: -45 },
              ( 
                (currWeek === idx + 1 && isCurrent && frequency === 'Weekly') 
                || (monthIdx === idx + 1 && isCurrent && frequency === 'Monthly') 
              ) ? { color: Colors.pink.dark, fontWeight: 'bold' } 
              : {}
            ]}>
                {frequency === 'Weekly' 
                  ? `Week ${idx + 1}`
                  : getMonth(idx + 1).slice(0, 3)
                }
            </Text>

            <Text style={[
              styles.value, 
              { fontSize: frequency === 'Weekly' ? 15 : 10 }
            ]}>
              {times === value && 
                <Text style={{ fontSize: frequency === 'Weekly' ? 10 : 5, color: Colors.green.reg }}>✔️</Text>
              }
              {value !== 0 && value}
            </Text>
          </View>
        )}
      </View>
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
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
    flexDirection: 'row',
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
    textAlign: 'right',
    width: 60 
  }
})

export default BarChart