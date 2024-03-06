//npm
import { FC, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//utils & store
import { getCurrentDate, getDayOfWeek, getDaysInMonth, getYears, months } from "@utils/datetime"
import { useActiveCareDate, useActiveCareMonth, useActiveCareYear, useCareActions } from "@store/store"
//components
import ScrollSelector from "./ScrollSelector"
//styles
import { Colors, Spacing, Typography } from "@styles/index"
import { SubButton } from "./ButtonComponent"
import { FlatList } from "react-native-gesture-handler"

const ScrollCalendar = () => {
  const { date: currDate, month: currMonth, year: currYear, week: currWeek, daysInMonth: currMonthDays } = getCurrentDate()
  const [selectedDate, setSelectedDate] = useState<number>(currDate - 1)
  const [selectedMonth, setSelectedMonth] = useState<number>(currMonth - 1)
  const [selectedYear, setSelectedYear] = useState<number>(currYear)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const scrollViewRef = useRef(null)

  const years = getYears()
  const activeCareDate = useActiveCareDate()
  const activeCareMonth = useActiveCareMonth()
  const activeCareYear = useActiveCareYear()
  const { setActiveCareDate, setActiveCareWeek, setActiveCareMonth, setActiveCareYear } = useCareActions()

  const currentDateIsActive = activeCareDate === null || activeCareDate === currDate - 1
  const currMonthIsActive = activeCareMonth === null || activeCareMonth === currMonth - 1
  const currYearIsActive = activeCareYear === null || activeCareYear === currYear
  
  console.log(
    'currMonth active',currMonthIsActive, 
    'currYear active', currYearIsActive, 
    'activeMonth', activeCareMonth, //0-index
    'activeYear', activeCareYear
  )

  const month = []
  const numDays = 
    currMonthIsActive ? currMonthDays 
    : currYearIsActive ? getDaysInMonth(activeCareMonth, activeCareYear) 
    : getDaysInMonth(activeCareMonth, currYear)
  
  for (let i = 0; i < numDays; i++) {
    const day = getDayOfWeek(new Date(
      activeCareYear ?? currYear, 
      activeCareMonth ?? currMonth - 1,  //month 0-11
      i + 1 //date 1-31
    ))
    
    month.push(
      <TouchableOpacity key={i} style={[styles.dateContainer, i + 1 === currDate && styles.currCon, selectedDate === i && styles.activeCon]} onPress={() => { 
        setSelectedDate(i)
        setActiveCareDate(i) 
        setActiveCareWeek(Math.floor(i / 7))
      }}
      >
        <Text style={[styles.date, i + 1 === currDate && styles.currDay, selectedDate === i && styles.activeDay]}>{i + 1}</Text>
        <Text style={[styles.day, i + 1 === currDate && styles.currDay, selectedDate === i && styles.activeDay]}>{day.slice(0, 3)}</Text>
      </TouchableOpacity>
    )
  }

  const scrollToPos = (index: number) => {
    if (scrollViewRef.current) {
      console.log(index)
      scrollViewRef.current.scrollToIndex({ index: index, viewPosition: 0 })
    }
  }

  return (
    <View style={styles.container}>
      {(!currentDateIsActive || !currMonthIsActive) && 
        <TouchableOpacity style={[styles.headerBtnCon, styles.left]} onPress={() => {
          setSelectedDate(currDate - 1)
          setActiveCareDate(currDate - 1)
          setActiveCareWeek(currWeek)
          setActiveCareMonth(currMonth - 1)
          setActiveCareYear(currYear)
          scrollToPos(currDate - 1) 
        }}>
          <Text style={styles.headerBtnText}>Today</Text>
          <Text style={styles.headerBtnText}>▶︎</Text>
        </TouchableOpacity>
      }
      <TouchableOpacity style={[styles.headerBtnCon, styles.right]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.headerBtnText}>◀︎</Text>
        <Text style={styles.headerBtnText}>History</Text>
      </TouchableOpacity>

      <FlatList
        ref={scrollViewRef}
        horizontal
        data={month}
        getItemLayout={(data, index) => (
          {length: 50, offset: 58 * index, index}
        )}
        renderItem={({ item, index }) => item}
        initialScrollIndex={currDate - 1}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={styles.modalCon}>
          <View style={styles.modalItemCon}>
            <Text style={{ ...Typography.smallHeader }}>Show past data</Text>
            <View style={styles.selectors}>
              <ScrollSelector data={months} onSelect={setSelectedMonth} initialPos={currMonth - 1} />
              <ScrollSelector data={years} onSelect={setSelectedYear} initialPos={years.findIndex((e) => e === currYear)} />
            </View>
            <View style={styles.modalBtnCon}>
              
              <SubButton title='Confirm' top={0} bottom={0}
                onPress={() => {
                  setSelectedDate(selectedMonth === currMonth - 1 ? currDate - 1 : 0)
                  setActiveCareDate(selectedMonth === currMonth - 1 ? currDate - 1 : 0)
                  setActiveCareMonth(selectedMonth)
                  setActiveCareYear(selectedYear)
                  scrollToPos(selectedMonth === currMonth - 1 ? currDate - 1 : 0)
                  setModalVisible(false)
                }}
              />
              <SubButton title='Cancel' top={0} bottom={0}
                onPress={() => {
                  setSelectedDate(currDate - 1)
                  setActiveCareDate(currDate - 1)
                  setActiveCareMonth(currMonth - 1)
                  setActiveCareYear(currYear)
                  scrollToPos(currDate - 1)
                  setModalVisible(false)
                }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 70,
    backgroundColor: Colors.lightPink,
  },
  scrollContent: {
    height: 60,
  },
  dateContainer: {
    height: 60,
    width: 50,
    marginHorizontal: 4,
    borderRadius: 15,
    ...Spacing.centered,
    borderWidth: 1,
    borderColor: Colors.pink
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.pink
  },
  day: {
    color: Colors.pink
  },
  currDay: {
    color: Colors.white,
  },
  activeDay: {
    color: Colors.white
  },
  activeCon: {
    backgroundColor: Colors.pink,
    borderWidth: 0,
  },
  currCon: {
    backgroundColor: Colors.purpleArray[2],
    borderWidth: 0,
  },
  headerBtnCon: {
    position: 'absolute',
    top: -60,
    height: 30,
    width: 90,
    backgroundColor: Colors.pink,
    ...Spacing.flexRow,
  },
  headerBtnText: {
    fontWeight: 'bold',
    color: Colors.white,
    marginHorizontal: 7
  },
  left: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    left: -20,
  },
  right: {
    borderTopLeftRadius: 15,
    right: -20,
    borderBottomLeftRadius: 15,
  },
  modalCon: {
    ...Spacing.fullWH,
    ...Spacing.centered,
    backgroundColor: Colors.lightestPink,
  },
  modalItemCon: {
    width: '70%',
    height: '40%',
    ...Spacing.centered,
  },
  selectors: {
    ...Spacing.flexRow,
  },
  modalBtnCon: {
    ...Spacing.flexRow,
  }
})
 
export default ScrollCalendar