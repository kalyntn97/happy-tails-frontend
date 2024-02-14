//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native"
//context
import { useCareContext } from "../context/CareContext"
//utils & services
import { Care } from "../services/careService"
//components
import ScrollPetList from "./ScrollPetList"
//styles
import { Buttons, Spacing, Forms, Colors } from '../styles'
import { AddButton } from "../styles/buttonComponent"

interface CareFeedProps {
  today: { currDate: number, currMonth: string, monthIdx: number, currYear: number, currWeek: number }
  navigation: any
  careCards: Care[]
}

const CareFeed: React.FC<CareFeedProps> = ({ today, navigation, careCards }) => {
  const [selected, setSelected] = useState<string>('day')

  const sortedCareCards: { [key: string]: Care[] } = careCards.reduce((result, careCard) => {
    const { frequency } = careCard
    result[frequency] = result[frequency] || []
    result[frequency].push(careCard)
    return result
  }, {})

  return (  
    <View style={styles.container}>
      <View style={styles.iconMenuContainer}>
        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
          <Text style={styles.taskCount}>{sortedCareCards['Daily']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/day.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'day' && styles.selected]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
          <Text style={styles.taskCount}>{sortedCareCards['Weekly']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/week.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'week' && styles.selected]}>This Week</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
          <Text style={styles.taskCount}>{sortedCareCards['Monthly']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/month.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'month' && styles.selected]}>This Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
          <Text style={styles.taskCount}>{sortedCareCards['Yearly']?.length ?? 0}</Text>
          <Image source={require('../assets/icons/year.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'year' && styles.selected]}>This Year</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ width: '100%', height: '95%' }}
        contentContainerStyle={styles.taskContainer}
      >
        {selected === 'day' && sortedCareCards['Daily']?.map((d, idx) =>
          <TouchableOpacity style={styles.task} key={`d-${idx}`}
            onPress={() => navigation.navigate('Care', { 
              screen: 'Index', params: {sectionIndex: 0, itemIndex: idx } 
            })}
          >
            <Text style={[
              d.trackers[d.trackers.length - 1].done[today.currDate - 1] === d.times && styles.done, 
              styles.taskText
            ]}>
              {d.name}
            </Text>
            <ScrollPetList petArray={d.pets} size='mini' />
          </TouchableOpacity>
        )}

        {selected === 'week' && sortedCareCards['Weekly']?.map((w, idx) =>
          <TouchableOpacity style={styles.task} key={`w-${idx}`}
            onPress={() => navigation.navigate('Care', { 
              screen: 'Index', params: {sectionIndex: 1, itemIndex: idx } 
            })}
          >
            <Text style={[
              w.trackers[w.trackers.length - 1].done[today.currWeek - 1] === w.times && styles.done, 
              styles.taskText
            ]}>
              {w.name}
            </Text>
            <ScrollPetList petArray={w.pets} size='mini' />
          </TouchableOpacity>
        )}

        {selected === 'month' && sortedCareCards['Monthly']?.map((m, idx) =>
          <TouchableOpacity style={styles.task} key={`m-${idx}`}
            onPress={() => navigation.navigate('Care', { 
              screen: 'Index', params: {sectionIndex: 2, itemIndex: idx } 
            })}
          >
            <Text style={[
              m.trackers[m.trackers.length - 1].done[today.monthIdx - 1] === m.times && styles.done, 
              styles.taskText
            ]}>
              {m.name}
            </Text>
            <ScrollPetList petArray={m.pets} size='mini' />
          </TouchableOpacity> 
        )}

        {selected === 'year' && sortedCareCards['Yearly']?.map((y, idx) => 
          <TouchableOpacity style={styles.task} key={`y-${idx}`}
            onPress={() => navigation.navigate('Care', { 
              screen: 'Index', params: {sectionIndex: 3, itemIndex: idx } 
            })}
          >
            <Text style={[
              y.trackers[y.trackers.length - 1].done[0] === y.times && styles.done, 
              styles.taskText
            ]}>
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
    marginVertical: 10,
  },
  task: {
    ...Spacing.flexRow,
    width: '90%',
    height: 60,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 15,
    marginVertical: 5
  },
  taskText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  taskIcon: {
    ...Forms.smallIcon,
  },
  mainBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.pink,
    marginTop: 50

  },
  btnText: {
    ...Buttons.buttonText,
  },
})
 
export default CareFeed