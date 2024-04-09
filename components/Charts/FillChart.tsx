//npm
import { StyleSheet, Text, View, useWindowDimensions } from "react-native"
//types & helpers
import * as careHelpers from '@care/careHelpers'
//utils
import { getDateInfo, getMonth } from "@utils/datetime"
import { getColor, getColorArray } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

const FillChart = ({ tracker, frequency, times }) => {
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const chartWidth = windowWidth * 0.9
  const chartHeight = windowHeight * 0.4
  const squareWidth = frequency === 'Weekly' ? chartWidth * 0.9 / 3.2 : chartWidth * 0.9 / 4

  const { trackerMonthName, trackerYear, isCurrent } = careHelpers.getTrackerInfo(tracker.name)
  const { monthName: currMonth, week: currWeek } = getDateInfo(new Date())

  const colorArray = getColorArray()

  return (  
    <View style={[styles.container, 
      { width: chartWidth,
        height: frequency === 'Weekly' ? squareWidth * 2 : squareWidth * 4
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{frequency === 'Weekly' ? trackerMonthName.slice(0, 3).toUpperCase() : trackerYear }</Text>
      </View>

      <View style={styles.chart}>
        {tracker.done.map((value, index) => 
          <View key={index} style={[
            styles.square,
            { width: squareWidth, height: squareWidth,
              borderColor: 
              ( (currWeek === index + 1 && isCurrent && frequency === 'Weekly') 
                || (currMonth === index + 1 && isCurrent && frequency === 'Monthly') 
              ) ? Colors.pink.dark : Colors.white,
              backgroundColor: getColor(times, value, colorArray),
            }
        
          ]}>
            <Text style={[
              styles.label,
              // { color: 
              //   ( (currWeek === index + 1 && isCurrent && frequency === 'Weekly') 
              //     || (currMonth === index + 1 && isCurrent && frequency === 'Monthly') 
              //   ) ? Colors.pink.dark : Colors.white
              // }
            ]}>
              {frequency === 'Monthly' ? getMonth(index + 1).slice(0, 3) : `Week ${index + 1}`}
            </Text>
            <Text style={styles.value}>{value ? '✔︎' : ''}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    marginTop: 20,
    marginBottom: 10,
  },
  square: {
    borderWidth: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  header: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  chart: {
    width: '85%',
    height: '100%',
    ...Spacing.flexRow,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  value: {
    fontSize: 40,
    color: Colors.white
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold'
  },
})

export default FillChart