//npm
import { useWindowDimensions, StyleSheet, Text, View } from "react-native"
//types & helpers
import * as careHelpers from '@care/careHelpers'
//utils
import { getDateInfo } from "@utils/datetime"
import { getColor, getColorArray } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface DailyChartProps {
  // tracker: Tracker
  tracker: any
  times: number
}

const DailyChart: React.FC<DailyChartProps> = ({ tracker, times }) => {
  const { trackerMonthName, trackerYear, isCurrent } = careHelpers.getTrackerInfo(tracker.name)
  const { date: currDate } = getDateInfo('today')

  const colorArray = getColorArray()

  const windowWidth = useWindowDimensions().width
  const chartWidth = windowWidth * 0.9 * 0.9
  const squareWidth = chartWidth / 7

  const CalendarHeader = () => {
    const header = []
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    for (let i = 0; i < days.length; i++) {
      header.push(
        <Text style={[styles.headerText, { width: squareWidth }]} key={i}>
          {days[i]}
        </Text>
      )
    }

    return (
      <View style={[styles.header, { width: chartWidth, height: 15 }]}>
        {header}
      </View>
    )
  }

  const CalendarFiller = () => {
    const fillers = []
    for (let i = 0; i < tracker.firstDay; i++) {
      fillers.push(
        <View style={{ width: squareWidth, height: squareWidth }} key={i}></View>
      )
    }

    return (
      <>{fillers}</>
    )
  }

  return (  
    <View style={[styles.container, { width: chartWidth, height: chartWidth + 45 }]}>
      <View style={styles.chartName}>
        <Text style={styles.year}>{trackerYear}</Text>
        <Text style={styles.month}>{trackerMonthName}</Text>
      </View>
      <CalendarHeader />
      <View style={[styles.calendar, { width: chartWidth, height: 'auto' }]}>
        <CalendarFiller />
        {tracker.done.map((value, idx) => 
          <View key={idx} 
            style={[
              styles.dayContainer, { 
                backgroundColor: getColor(times, value, colorArray),
                width: squareWidth,
                height: squareWidth,
                borderColor: (currDate === idx + 1 && isCurrent) ? Colors.pink.dark : Colors.white
              }
            ]}>
              <Text style={styles.day}>{idx + 1}</Text>
              {value === times && 
                <Text style={styles.dot}>✔︎</Text>
              }
          </View>  
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  header: {
    ...Spacing.flexRow,
  },
  headerText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    borderRadius: 8,
  },
  chartName: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  dayContainer: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  year: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  month: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  day: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    // color: Colors.white,
  },
  dot: {
    color: Colors.white,
    fontSize: 20
  },
})

export default DailyChart