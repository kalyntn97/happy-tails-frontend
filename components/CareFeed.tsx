//npm
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, Text, View } from "react-native"
//services & utils
import { Care } from "../services/careService"
import * as careUtils from '../utils/careUtils'
import * as careService from '../services/careService'
//context
import { useCareContext } from "../context/CareContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CareFeedProps {
  careCards: Care[]
  today: { currDate: number, currMonth: string, monthIdx: number, currYear: number, currWeek: number }
}

const CareFeed: React.FC<CareFeedProps> = ({ today }) => {
  // const [careFeed, setCareFeed] = useState<Care[]>([])
  const { careCards } = useCareContext()
  
  const daily = []
  const weekly = []
  const monthly = []
  const yearly = []

  careCards.map(care => {
    console.log('care', care)
    switch (care.frequency) {
      case 'Daily': 
        return daily.push(care)
      case 'Weekly': 
        return weekly.push(care)
      case 'Monthly': 
        return monthly.push(care)
      case 'Yearly': 
        return yearly.push(care)
    }
  })

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchCareFeed = async () => {
  //       const data = await careService.careFeed()
  //       setCareFeed(data)
  //     }
  //     fetchCareFeed()
  //   }, [])
  // )

  return (  
    <View style={styles.container}>
      <Text>{today.currMonth} {today.currDate} {today.currYear}</Text>
      <Text>Due today</Text>
      {daily.map(d => 
        <Text 
          style={d.trackers[d.trackers.length - 1].done[today.currDate - 1] === d.times ? styles.done : {}}
        >
          {d.name}
        </Text>
      )}
      <Text>Due this week</Text>
      {weekly.map(w => 
        <Text
        style={w.trackers[w.trackers.length - 1].done[today.currWeek - 1] === w.times ? styles.done : {}}
        >
          {w.name}
        </Text>
      )}
      <Text>Due this month</Text>
      {monthly.map(m => 
        <Text
          style={m.trackers[m.trackers.length - 1].done[today.monthIdx - 1] === m.times ? styles.done : {}}
        >
          {m.name}
        </Text>
      )}
      <Text>Due this year</Text>
      {yearly.map(y => 
        <Text
        style={y.trackers[y.trackers.length - 1].done === y.times ? styles.done : {}}
        >
          {y.name}
        </Text>
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  }
  
})
 
export default CareFeed