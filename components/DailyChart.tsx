//npm
import { useWindowDimensions, StyleSheet, Text, View } from "react-native"
//services & utils
import { Tracker } from "../services/careService"
import * as careUtils from '../utils/careUtils'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface DailyChartProps {
  // tracker: Tracker
  tracker: any
  times: number
}

const DailyChart: React.FC<DailyChartProps> = ({ tracker, times }) => {
  // const { date: currDate, month: currMonth, year: currYear } = careUtils.getCurrentDate()
  // const splitName = tracker.name.split('-') // output month & year
  // const month = careUtils.getMonth(Number(splitName[0]))
  // const year = Number(splitName[1])
  // const isCurrent = currMonth == Number(splitName[0]) && currYear == year
  const { month, year, currDate, isCurrent } = careUtils.getDateTimeFromTracker(tracker.name)

  const colorArray = careUtils.getColorArray()

  const windowWidth = useWindowDimensions().width
  const chartWidth = windowWidth * 0.9
  const squareWidth = chartWidth / 7

  console.log(tracker)

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
    console.log(tracker.firstDay, 'first day')
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
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.month}>{month}</Text>
      </View>
      <CalendarHeader />
      <View style={[styles.calendar, { width: chartWidth, height: 'auto' }]}>
        <CalendarFiller />
        {tracker.done.map((value, idx) => 
          <View key={idx} 
            style={[
              styles.dayContainer, { 
                backgroundColor: careUtils.getColor(times, value, colorArray),
                width: squareWidth,
                height: squareWidth,
                borderColor: (currDate === idx + 1 && isCurrent) ? Colors.darkPink : 'white'
              }
            ]}>
              <Text style={styles.day}>{idx + 1}</Text>
              {value === times && 
                <Text style={styles.dot}>{'✔︎'}</Text>
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
    ...Spacing.flexRow,
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
    // color: 'white',
  },
  dot: {
    color: 'white',
    // fontSize: 15
  },
})

export default DailyChart