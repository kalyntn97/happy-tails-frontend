//npm
import { FC, useRef, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native"
//utils & store
import { getDateInfo, getDayOfWeek, getDaysInMonth, getMonth, getWeekIndex, getYears, months } from "@utils/datetime"
import { useActiveDate, useCurrentIsActive, useSetActions } from "@store/store"
//components
import ScrollSelector from "@components/ScrollSelector"
import { SubButton } from "@components/ButtonComponent"
//styles
import { Colors, Spacing, Typography } from "@styles/index"

const ScrollCalendar = () => {
  const { date: currDate, month: currMonth, year: currYear, week: currWeek, daysInMonth: currMonthDays, monthName: currMonthName } = getDateInfo('today')
  const years = getYears()

  const [selectedMonth, setSelectedMonth] = useState<number>(currMonth - 1)
  const [selectedYear, setSelectedYear] = useState<number>(currYear)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const {date: activeDate, month: activeMonth, year: activeYear } = useActiveDate()
  const { date: currDateIsActive, month: currMonthIsActive, year: currYearIsActive } = useCurrentIsActive()
  const todayIsActive = currDateIsActive && currMonthIsActive && currYearIsActive
  const pastIsActive = new Date(activeYear, activeMonth, activeDate + 1) < new Date() && new Date(activeYear, activeMonth, activeDate + 1).toDateString() !==  new Date().toDateString()

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
      <Text style={styles.middle}>{activeMonthName}</Text>
      
      <TouchableOpacity style={[todayIsActive && styles.activeHeaderBtnCon, styles.headerBtnCon, styles.left]} 
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
        <Text style={[{ color: todayIsActive ? Colors.white : Colors.pink.dark }, styles.headerBtnText]}>Today</Text>
        <Text style={[{ color: todayIsActive ? Colors.white : Colors.pink.dark }, styles.headerBtnText]}>▶︎</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[pastIsActive && styles.activeHeaderBtnCon, styles.headerBtnCon, styles.right]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[{ color: pastIsActive ? Colors.white : Colors.pink.dark }, styles.headerBtnText]}>◀︎</Text>
        <Text style={[{ color: pastIsActive ? Colors.white : Colors.pink.dark }, styles.headerBtnText]}>History</Text>
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
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={{ ...Spacing.fullScreenCentered }}>
          <View style={styles.modalItemCon}>
            <Text style={{ ...Typography.smallHeader }}>Show past data</Text>
            <View style={styles.selectors}>
              <ScrollSelector data={months} onSelect={setSelectedMonth} initialPos={currMonth - 1} />
              <ScrollSelector data={years} onSelect={setSelectedYear} initialPos={years.findIndex((e) => e === currYear)} />
            </View>
            <View style={styles.modalBtnCon}>
              
              <SubButton title='Confirm' color={Colors.pink.darkest} top={0} bottom={0}
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
    borderColor: Colors.pink.dark
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.pink.dark
  },
  day: {
    color: Colors.pink.dark
  },
  currDay: {
    color: Colors.white,
  },
  activeDay: {
    color: Colors.white
  },
  activeCon: {
    backgroundColor: Colors.pink.dark,
    borderWidth: 0,
  },
  currCon: {
    backgroundColor: Colors.purple.lightest,
    borderWidth: 0,
  },
  headerBtnCon: {
    position: 'absolute',
    top: -60,
    height: 30,
    width: 90,
    borderColor: Colors.pink.dark,
    borderWidth: 1.3,
    ...Spacing.flexRow,
  },
  activeHeaderBtnCon: {
    backgroundColor: Colors.pink.dark,
  },
  headerBtnText: {
    fontWeight: 'bold',
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
    position: 'absolute',
    top: -55,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.pink.dark,
  },
  modalItemCon: {
    width: '70%',
    height: '40%',
    ...Spacing.centered,
  },
  selectors: {
    ...Spacing.flexRow,
    marginTop: 10,
  },
  modalBtnCon: {
    ...Spacing.flexRow,
    marginTop: 30,
  }
})
 
export default ScrollCalendar