//npm
import { StyleSheet, Text, View } from "react-native"
//services & utils
import { Care } from "../services/careService"
import * as careUtils from '../utils/careUtils'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CareFeedProps {
  careCards: Care[]
  today: { currDate: number, currMonth: string, currYear: number }
}

const CareFeed: React.FC<CareFeedProps> = ({ careCards, today }) => {
  console.log('careCards', careCards)
  return (  
    <View style={styles.container}>
      <Text>{today.currMonth} {today.currDate} {today.currYear}</Text>
      {careCards.map(care =>
        <View>
          {care.frequency === 'Daily' ?
            <>
              <Text>Due Today</Text>
              <Text>{care.name}</Text>
            </>
          : care.frequency === 'Weekly' ?
            <>
              <Text>Due This Week</Text>
              <Text>{care.name}</Text>
            </>
          : care.frequency === 'Monthly' ?
            <>
              <Text>Due This Month</Text>
            </>
          : care.frequency === 'Yearly' &&
            <>
              <Text>Due This Year</Text>
            </>
          }
        </View>
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
})
 
export default CareFeed