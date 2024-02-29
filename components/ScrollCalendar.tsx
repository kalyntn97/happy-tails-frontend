import { useRef, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getCurrentDate, getDayOfWeek } from "@utils/datetime"
import { Colors, Spacing } from "@styles/index"

const ScrollCalendar = () => {
  const { date: currDate, month: currMonth, year: currYear, daysInMonth } = getCurrentDate()
  const [selected, setSelected] = useState<number>(currDate - 1)

  const scrollViewRef = useRef(null)
  const month = []
  for (let i = 0; i < daysInMonth; i++) {
    const day = getDayOfWeek(new Date(currYear, currMonth, i))
    month.push(
      <TouchableOpacity key={i} style={[styles.dateContainer, i + 1 === currDate && styles.currCon, selected === i && styles.activeCon]} onPress={() => setSelected(i)}>
        <Text style={[styles.date, i + 1 === currDate && styles.currDay, selected === i && styles.activeDay]}>{i + 1}</Text>
        <Text style={[styles.day, i + 1 === currDate && styles.currDay, selected === i && styles.activeDay]}>{day.slice(0, 3)}</Text>
      </TouchableOpacity>
    )
  }

  const scrollToPos = () => {
    if (scrollViewRef.current) {
      const offset = currDate * 50 + 150 
      scrollViewRef.current.scrollTo({ x: offset, animated: true })
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={scrollToPos} // default position
        scrollEventThrottle={200}
        decelerationRate="fast"
      >
        { month }
      </ScrollView>
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
})
 
export default ScrollCalendar