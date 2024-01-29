//npm
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Image, ImageStyle, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//services & utils
import { Care } from "../services/careService"
import * as careUtils from '../utils/careUtils'
import * as careService from '../services/careService'
//context
import { useCareContext } from "../context/CareContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface CareFeedProps {
  today: { currDate: number, currMonth: string, monthIdx: number, currYear: number, currWeek: number }
  navigation: any
}

const CareFeed: React.FC<CareFeedProps> = ({ today, navigation }) => {
  const [selected, setSelected] = useState<string>('day')
  const { careCards } = useCareContext()
  
  const daily = []
  const weekly = []
  const monthly = []
  const yearly = []

  careCards.forEach(care => {
    switch (care.frequency) {
      case 'Daily': 
        daily.push(care)
        break
      case 'Weekly': 
        weekly.push(care)
        break
      case 'Monthly': 
        monthly.push(care)
        break
      case 'Yearly': 
        yearly.push(care)
        break
    }
  })

  return (  
    <View style={styles.container}>
      <Text>{today.currMonth} {today.currDate} {today.currYear}</Text>
      <View style={styles.iconMenuContainer}>
        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
          <Image source={require('../assets/icons/day.png')} style={styles.icon as ImageStyle} />
          <Text style={styles.iconText}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
          <Image source={require('../assets/icons/week.png')} style={styles.icon as ImageStyle} />
          <Text style={styles.iconText}>This Week</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
          <Image source={require('../assets/icons/month.png')} style={styles.icon as ImageStyle} />
          <Text style={styles.iconText}>This Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
          <Image source={require('../assets/icons/year.png')} style={styles.icon as ImageStyle} />
          <Text style={styles.iconText}>This Year</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.taskContainer}>
        {selected === 'day' && daily.map((d, idx) => 
          <Text key={`d-${idx}`}
            style={d.trackers[d.trackers.length - 1].done[today.currDate - 1] === d.times ? styles.done : {}}
          >
            {d.name}
          </Text>
        )}

        {selected === 'week' && weekly.map((w, idx) => 
          <Text key={`w-${idx}`}
          style={w.trackers[w.trackers.length - 1].done[today.currWeek - 1] === w.times ? styles.done : {}}
          >
            {w.name}
          </Text>
        )}

        
        {selected === 'month' && monthly.map((m, idx) => 
          <Text key={`m-${idx}`}
            style={m.trackers[m.trackers.length - 1].done[today.monthIdx - 1] === m.times ? styles.done : {}}
          >
            {m.name}
          </Text>
        )}

        
        {selected === 'year' && yearly.map((y, idx) => 
          <Text key={`y-${idx}`}
          style={y.trackers[y.trackers.length - 1].done === y.times ? styles.done : {}}
          >
            {y.name}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Care')}>
        <Text style={styles.btnText}>Manage Tasks</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH,
    alignItems: 'center',
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  iconMenuContainer: {
    ...Spacing.flexRow,
    width: '100%',
    height: 50,
    marginVertical: 10
  },
  iconMenu: {
    ...Spacing.flexColumn,
    flexBasis: '25%',
  },
  icon: {
    ...Forms.smallIcon,
  },
  iconText: {

  },
  taskContainer: {
    ...Spacing.flexColumn,
    width: '100%',
    marginVertical: 10,
  },
  mainBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.pink
  },
  btnText: {
    ...Buttons.buttonText,
  },
})
 
export default CareFeed