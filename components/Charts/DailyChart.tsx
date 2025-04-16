//npm
import { useWindowDimensions, StyleSheet, Text, View } from "react-native"
//types & helpers
import * as careHelpers from '@care/careHelpers'
//utils
import { compareDates, getDateInfo } from "@utils/datetime"
import { getColor, getColorArray } from "@utils/ui"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { Care, Log } from "@care/CareInterface"
import { numArray } from "@utils/misc"
import { HScrollContainer, VScrollContainer } from "@components/UIComponents"

interface DailyChartProps {
  logs: Log[]
  startDate: string
  timesPerDay: number
}

interface DailyHistoryProps {
  care: Care
}

const CalendarHeader = ({ chartWidth, squareWidth }: { chartWidth: number, squareWidth: number }) => {
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

const CalendarFiller = ({ dayIndex, squareWidth }: { dayIndex: number, squareWidth: number }) => {
  const fillers = []
  for (let i = 0; i < dayIndex; i++) {
    fillers.push(
      <View style={{ width: squareWidth, height: squareWidth }} key={i}></View>
    )
  }

  return (
    <>{fillers}</>
  )
}

const DailyChart = ({ startDate, logs, timesPerDay }: DailyChartProps) => {
  const { date: currentDate, monthName: currentMonthName, year: currentYear } = getDateInfo('today')
  const { monthName, year, dayIndex, daysInMonth } = getDateInfo(startDate)

  const isCurrentMonth = currentMonthName === monthName && currentYear === year

  const colorArray = getColorArray()

  const windowWidth = useWindowDimensions().width
  const chartWidth = windowWidth * 0.9 * 0.9
  const squareWidth = chartWidth / 7

  const loggedDates = logs?.length ? logs.map(log => ({ date: getDateInfo(log.date).date, value: log.value })) : []

  return (  
    <View style={[styles.container, { width: chartWidth, height: chartWidth + 45 }]}>
      <View style={styles.chartName}>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.month}>{monthName}</Text>
      </View>
      <CalendarHeader chartWidth={chartWidth} squareWidth={squareWidth} />
      <View style={[styles.calendar, { width: chartWidth, height: 'auto' }]}>
        <CalendarFiller dayIndex={dayIndex} squareWidth={squareWidth} />
        { numArray(daysInMonth).map(value => {
          const loggedValue = loggedDates.find(l => l.date === value).value
          const isCompleted = loggedValue === timesPerDay
          const isCurrentDate = isCurrentMonth && value === currentDate

          return (
            <View key={value} 
              style={[
                styles.dayContainer, { 
                  backgroundColor: getColor(timesPerDay, loggedValue, colorArray),
                  width: squareWidth,
                  height: squareWidth,
                  borderColor: isCurrentDate ? Colors.pink.dark : Colors.white
                }
              ]}>
                <Text style={styles.day}>{value}</Text>
                { isCompleted && 
                  <Text style={styles.dot}>✔︎</Text>
                }
            </View> 
          ) 
        }) }
      </View>
    </View>
  )
}

export const DailyHistory = ({ care }: DailyHistoryProps) => {
  

  return (
    <HScrollContainer>
      <Text>placeholder</Text>
    </HScrollContainer>
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