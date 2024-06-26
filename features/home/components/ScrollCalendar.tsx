//npm
import { FC, useRef, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, FlatList, ViewStyle, TextStyle, useWindowDimensions } from "react-native"
//utils & store
import { getDateInfo, getDayOfWeek, getDaysInMonth, getMonth, getWeekIndex, getYears, months } from "@utils/datetime"
import { useActiveDate, useCurrentIsActive, useSetActions } from "@store/store"
//components
import ScrollSelector from "@components/ScrollSelector"
import { SubButton } from "@components/ButtonComponent"
//styles
import { Colors, Spacing, Typography, Forms } from "@styles/index"

type Style = ViewStyle | TextStyle

const NavButtons = ({ condition, position, title, onPress }) => {
  const color = condition ? Colors.white : Colors.pink.dark

  return (
  <TouchableOpacity style={[condition && styles.activeHeaderBtnCon, styles.headerBtnCon, position === 'left' ? { ...Forms.rightMoreRounded} : { ...Forms.leftMoreRounded }]} 
      onPress={onPress}>
      { position === 'right' && <Text style={[{ color: color }, styles.headerBtnText]}>◀︎</Text> }
      <Text style={[{ color: color }, styles.headerBtnText]}>{title}</Text>
      { position === 'left' && <Text style={[{ color: color }, styles.headerBtnText]}>▶︎</Text> }
    </TouchableOpacity>
  ) 
}

const ScrollCalendar = () => {
  const { date: currDate, month: currMonth, year: currYear, week: currWeek, daysInMonth: currMonthDays } = getDateInfo('today')
  const years = getYears()

  const [selectedMonth, setSelectedMonth] = useState<number>(currMonth - 1)
  const [selectedYear, setSelectedYear] = useState<number>(currYear)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const scrollViewRef = useRef(null)

  const {date: activeDate, month: activeMonth, year: activeYear } = useActiveDate()
  const { date: currDateIsActive, month: currMonthIsActive, year: currYearIsActive } = useCurrentIsActive()
  const { setActiveDate } = useSetActions()

  const NAV_TOP = 20
  const SCROLL_WIDTH = useWindowDimensions().width
  const CHILD_WIDTH = 50
  const CHILD_MARGIN = 4
  const VISIBLE_CHILDREN = 6
  const VISIBLE_WIDTH = (CHILD_WIDTH + CHILD_MARGIN * 2) * VISIBLE_CHILDREN

  const DARK_TEXT = { color: Colors.pink.dark }
  const LIGHT_TEXT = { color: Colors.white }
  const DATE_CON = { ...styles.dateContainer, width: CHILD_WIDTH, marginHorizontal: CHILD_MARGIN }
  const ACTIVE_CON = { backgroundColor: Colors.pink.dark, borderWidth: 0 }
  const CURRENT_CON = { backgroundColor: Colors.purple.lightest, borderWidth: 0 }

  const todayIsActive = currDateIsActive && currMonthIsActive && currYearIsActive
  const pastIsActive = new Date(activeYear, activeMonth, activeDate + 1) < new Date() && new Date(activeYear, activeMonth, activeDate + 1).toDateString() !==  new Date().toDateString()
  const activeMonthName = getMonth(activeMonth + 1)

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

    const getStyle = (baseStyle: Style, currStyle: Style, activeStyle: Style) => [
      baseStyle,
      i + 1 === currDate && currStyle,
      i === activeDate && activeStyle
    ]

    month.push(
      <TouchableOpacity key={i} 
        style={getStyle(DATE_CON, CURRENT_CON, ACTIVE_CON)}
        onPress={() => { 
          setActiveDate({ date: i, week: Math.floor((i + 1)/ 7), month: activeMonth, year: activeYear })
        }}
      >
        <Text style={getStyle(DARK_TEXT, LIGHT_TEXT, LIGHT_TEXT)}>{day.slice(0, 3)}</Text>
        <Text style={getStyle(styles.date, LIGHT_TEXT, LIGHT_TEXT)}>{i + 1}</Text>
      </TouchableOpacity>
    )
  }
  
  const nav = [
    { title: 'Today', condition: todayIsActive, position: 'left', onPress: () => {
      setActiveDate({ date: currDate - 1, week: currWeek - 1, month: currMonth - 1, year: currYear })
      scrollToPos(currDate - 1) 
    } },
    { title: 'History', condition: pastIsActive, position: 'right', onPress: () => setModalVisible(true)},
  ]

  const selectors = [
    { key: 'month', data: months, onSelect: setSelectedMonth, initial: currMonth - 1},
    { key: 'year', data: years, onSelect: setSelectedYear, initial: years.findIndex(e => e === currYear) },
  ]

  const scrollToPos = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToIndex({ index: index, viewPosition: 0 })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.middle, { top: NAV_TOP }]}>{activeMonthName}</Text>
      <View style={[styles.navCon, { marginBottom: NAV_TOP }]}>
        {nav.map(n =>
          <NavButtons key={n.title} title={n.title} condition={n.condition} onPress={n.onPress} position={n.position} />
        )}
      </View>

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
        snapToInterval={VISIBLE_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: (SCROLL_WIDTH - VISIBLE_WIDTH) / 2 }}
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
              {selectors.map(selector =>
                <ScrollSelector key={selector.key} data={selector.data} onSelect={selector.onSelect} initial={selector.initial} />
              )}
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
    width: '100%',
    paddingVertical: 20,
  },
  dateContainer: {
    height: 60,
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
  navCon: {
    width: '100%',
    ...Spacing.flexRow,
    justifyContent: 'space-between',
  },
  headerBtnCon: {
    ...Spacing.flexRow,
    height: 30,
    width: 90,
    borderColor: Colors.pink.dark,
    borderWidth: 1.3,
  },
  activeHeaderBtnCon: {
    backgroundColor: Colors.pink.dark,
  },
  headerBtnText: {
    fontWeight: 'bold',
    marginHorizontal: 7
  },
  middle: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.pink.dark,
  },
  modalItemCon: {
    ...Spacing.centered,
    width: '70%',
    height: '40%',
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