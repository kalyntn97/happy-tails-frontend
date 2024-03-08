//npm
import { FC, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native"
//utils & store
import { getCurrentDate, getDayOfWeek, getDaysInMonth, getMonth, getWeekIndex, getYears, months } from "@utils/datetime"
import { useActiveDate, useCurrentIsActive, useSetActions } from "@store/store"
//components
import ScrollSelector from "../../../components/ScrollSelector"
import { SubButton } from "../../../components/ButtonComponent"
//styles
import { Colors, Spacing, Typography } from "@styles/index"

const ScrollCalendar = () => {
  const { date: currDate, month: currMonth, year: currYear, week: currWeek, daysInMonth: currMonthDays, monthName: currMonthName } = getCurrentDate()
  const years = getYears()

  const [selectedMonth, setSelectedMonth] = useState<number>(currMonth - 1)
  const [selectedYear, setSelectedYear] = useState<number>(currYear)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const {date: activeDate, month: activeMonth, year: activeYear } = useActiveDate()
  const { date: currDateIsActive, month: currMonthIsActive, year: currYearIsActive } = useCurrentIsActive()
  const { setActiveDate } = useSetActions()
  const activeMonthName = getMonth(activeMonth + 1)
  
  const scrollViewRef = useRef(null)
  const month = []
  const numDays = 
    currMonthIsActive ? currMonthDays 
    : currYearIsActive ? getDaysInMonth(activeMonth, currYear) 
    : getDaysInMonth(activeMonth, activeYear)
  
  for (let i = 0; i < numDays; i++) {
    const day = getDayOfWeek(new Date(
      activeYear ?? currYear, 
      activeMonth ?? currMonth - 1,  //month 0-11
      i + 1 //date 1-31
    ))
    
    month.push(
      <TouchableOpacity key={i} 
      style={[
        styles.dateContainer, 
        i + 1 === currDate && styles.currCon, 
        activeDate === i && styles.activeCon
      ]} 
      onPress={() => { 
        setActiveDate({ 
          date: i, 
          week: Math.floor((i + 1)/ 7), 
          month: activeMonth, 
          year: activeYear 
        })
      }}
      >
        <Text style={[
          styles.date, 
          i + 1 === currDate && styles.currDay, 
          activeDate === i && styles.activeDay
          ]}>
            {i + 1}
        </Text>
        <Text style={[
          styles.day, 
          i + 1 === currDate && styles.currDay, 
          activeDate === i && styles.activeDay
        ]}>
            {day.slice(0, 3)}
        </Text>
      </TouchableOpacity>
    )
  }

  const scrollToPos = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToIndex({ index: index, viewPosition: 0 })
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.headerBtnCon, styles.middle]}>
        <Text style={styles.headerBtnText}>{activeMonthName}</Text>
      </View>
      
      <TouchableOpacity style={[styles.headerBtnCon, styles.left]} 
        disabled={currDateIsActive && currMonthIsActive && currYearIsActive}
        onPress={() => {
          setActiveDate({ 
            date: currDate - 1, 
            week: currWeek - 1, 
            month: currMonth - 1, 
            year: currYear
          })
          scrollToPos(currDate - 1) 
        }
      }>
        <Text style={styles.headerBtnText}>Today</Text>
        <Text style={styles.headerBtnText}>▶︎</Text>
      </TouchableOpacity>
      
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
                  setActiveDate({ 
                    date: selectedMonth === currMonth - 1 ? currDate - 1 : 0, 
                    week: selectedMonth === currMonth - 1 ? getWeekIndex(currDate) : 0, 
                    month: selectedMonth, 
                    year: selectedYear 
                  })
                  scrollToPos(selectedMonth === currMonth - 1 ? currDate - 1 : 0)
                  setModalVisible(false)
                }}
              />
              <SubButton title='Cancel' top={0} bottom={0}
                onPress={() => {
                  setActiveDate({
                    date: currDate - 1, 
                    week: getWeekIndex(currDate), 
                    month: currMonth - 1, 
                    year: currYear 
                  })
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
  middle: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 15,
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