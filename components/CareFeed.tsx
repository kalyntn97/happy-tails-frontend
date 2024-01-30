//npm
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Image, ImageStyle, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native"
//services & utils
import { Care } from "../services/careService"
import * as careUtils from '../utils/careUtils'
import * as careService from '../services/careService'
//context
import { useCareContext } from "../context/CareContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import ScrollPetList from "./ScrollPetList"

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
      <View style={styles.iconMenuContainer}>
        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
          <Text style={styles.taskCount}>{daily.length}</Text>
          <Image source={require('../assets/icons/day.png')} style={styles.icon as ImageStyle} />
          <Text style={[styles.iconText, selected === 'day' ? styles.selected : {}]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
          <Text style={styles.taskCount}>{weekly.length}</Text>
          <Image source={require('../assets/icons/week.png')} style={styles.icon as ImageStyle} />
          <Text style={[styles.iconText, selected === 'week' ? styles.selected : {}]}>This Week</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
          <Text style={styles.taskCount}>{monthly.length}</Text>
          <Image source={require('../assets/icons/month.png')} style={styles.icon as ImageStyle} />
          <Text style={[styles.iconText, selected === 'month' ? styles.selected : {}]}>This Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
          <Text style={styles.taskCount}>{yearly.length}</Text>
          <Image source={require('../assets/icons/year.png')} style={styles.icon as ImageStyle} />
          <Text style={[styles.iconText, selected === 'year' ? styles.selected : {}]}>This Year</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{ width: '100%', height: '90%' }}
        contentContainerStyle={styles.taskContainer}
      >
        {selected === 'day' && daily.map((d, idx) =>
          <TouchableOpacity style={styles.task} onPress={() => navigation.navigate('Care', { screen: 'Index', params: {sectionIndex: 0, itemIndex: idx } })}>
            <Text key={`d-${idx}`}
              style={[
                d.trackers[d.trackers.length - 1].done[today.currDate - 1] === d.times ? styles.done : {}, 
                styles.taskText
              ]}
            >
              {d.name}
            </Text>
            <ScrollPetList petArray={d.pets} size='mini' />
          </TouchableOpacity>
        )}

        {selected === 'week' && weekly.map((w, idx) =>
          <TouchableOpacity style={styles.task} onPress={() => navigation.navigate('Care', { screen: 
          'Index', params: {sectionIndex: 1, itemIndex: idx } })}>
            <Text key={`w-${idx}`}
              style={[
                w.trackers[w.trackers.length - 1].done[today.currWeek - 1] === w.times ? styles.done : {}, 
                styles.taskText
              ]}
            >
              {w.name}
            </Text>
            <ScrollPetList petArray={w.pets} size='mini' />
          </TouchableOpacity>
        )}

        {selected === 'month' && monthly.map((m, idx) =>
          <TouchableOpacity style={styles.task} onPress={() => navigation.navigate('Care', { screen: 
            'Index', params: {sectionIndex: 2, itemIndex: idx } })}>
            <Text key={`m-${idx}`}
              style={[
                m.trackers[m.trackers.length - 1].done[today.monthIdx - 1] === m.times ? styles.done : {}, 
                styles.taskText
              ]}
            >
              {m.name}
            </Text>
            <ScrollPetList petArray={m.pets} size='mini' />
          </TouchableOpacity> 
        )}

        
        {selected === 'year' && yearly.map((y, idx) => 
          <TouchableOpacity style={styles.task} onPress={() => navigation.navigate('Care', { screen: 
            'Index', params: {sectionIndex: 3, itemIndex: idx } })}>
            <Text key={`y-${idx}`}
              style={[
                y.trackers[y.trackers.length - 1].done === y.times ? styles.done : {}, 
                styles.taskText
              ]}
            >
              {y.name}
            </Text>
            <ScrollPetList petArray={y.pets} size='mini' />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.mainBtn} 
          onPress={() => navigation.navigate('Care', { 
            screen: 'Index', 
            params: { 
              sectionIndex: 
                selected === 'day' ? 0 : selected === 'week' ? 1 : selected === 'month' ? 2 : 3,
              itemIndex: 0 
            } 
          })}>
          <Text style={styles.btnText}>Manage Tasks</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  iconMenuContainer: {
    ...Spacing.flexRow,
    width: '100%',
    height: '5%',
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
  taskCount: {
    color: Colors.red,
    fontWeight: 'bold',
    position: 'absolute',
    right: '25%',
    bottom: '25%',
  },
  selected: {
    color: Colors.red,
    fontWeight: 'bold',
  },
  taskContainer: {
    ...Spacing.flexColumn,
    width: '100%',
    minHeight: '30%',
    marginVertical: 10,
  },
  task: {
    ...Spacing.flexRow,
    width: '90%',
    height: 50,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: 'lightgray'
  },
  taskText: {
    fontSize: 15
  },
  mainBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.pink,
    marginTop: 'auto',
  },
  btnText: {
    ...Buttons.buttonText,
  },
})
 
export default CareFeed