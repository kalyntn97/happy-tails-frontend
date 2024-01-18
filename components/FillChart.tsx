//npm
import { StyleSheet, Text, View, useWindowDimensions } from "react-native"
//services & utils
import { Tracker } from "../services/careService"
import * as careUtils from '../utils/careUtils'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const FillChart = ({ tracker, frequency, times }) => {
  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const chartWidth = windowWidth * 0.9
  const chartHeight = windowHeight * 0.4
  const squareWidth = frequency === 'Weekly' ? chartWidth * 0.9 / 3.2 : chartWidth * 0.9 / 4

  const { week: currWeek } = careUtils.getCurrentDate()
  const { month, year, currMonth, isCurrent } = careUtils.getDateTimeFromTracker(tracker.name)

  const colorArray = careUtils.getColorArray()

  return (  
    <View style={[styles.container, 
      { width: chartWidth,
        height: frequency === 'Weekly' ? squareWidth * 2 : squareWidth * 4
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{frequency === 'Weekly' ? month.slice(0, 3).toUpperCase() : year }</Text>
      </View>

      <View style={styles.chart}>
        {tracker.done.map((value, index) => 
          <View style={[
            styles.square,
            { width: squareWidth, height: squareWidth,
              borderColor: 
              ( (currWeek === index + 1 && isCurrent && frequency === 'Weekly') 
                || (currMonth === index + 1 && isCurrent && frequency === 'Monthly') 
              ) ? Colors.darkPink : 'white',
              backgroundColor: careUtils.getColor(times, value, colorArray),
            }
        
          ]}>
            <Text style={[
              styles.label,
              // { color: 
              //   ( (currWeek === index + 1 && isCurrent && frequency === 'Weekly') 
              //     || (currMonth === index + 1 && isCurrent && frequency === 'Monthly') 
              //   ) ? Colors.darkPink : 'white'
              // }
            ]}>
              {frequency === 'Monthly' ? careUtils.getMonth(index + 1).slice(0, 3) : `Week ${index + 1}`}
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
    textAlign: 'center'
  },
  chart: {
    width: '85%',
    height: '100%',
    ...Spacing.flexRow,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 40,
    color: 'white'
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold'
  },
})

export default FillChart