//npm
import { useRef, useState, useEffect } from "react"
import { ScrollView, StyleSheet, Text, View, Image, ImageStyle } from "react-native"
//utils
import { getCurrentDate, getDaysOfWeek } from "../utils/careUtils"
//styles
import { Colors, Forms } from '../styles'

const ScrollCalendar = ({ tracker }) => {
  const [today, setToday] = useState
    <{date: number, month: number, year: number, day: string, daysInMonth: number}>
    ({ date: null, month: null, year: null, day: null, daysInMonth: null })

  const scrollViewRef = useRef(null)

  let dailyContainer = []
    for (let i = 0; i < today.daysInMonth; i++) {
      dailyContainer.push(
        <View style={styles.dailyBox} key={i}>
          <Text 
            style={[styles.dailyText, { color: i + 1 === today.date ? Colors.darkPink : 'black'}]}>
              {getDaysOfWeek(new Date(today.year, today.month - 1, i + 1)).slice(0, 3)}
          </Text>
          <Text style={[styles.dailyText, { color: i + 1 === today.date ? Colors.darkPink : 'black', fontSize: 20 }]}>{i + 1}</Text>
          {tracker?.done[i] === 1 
            ? <Image source={require('../assets/icons/heart-filled.png')} style={styles.heart as ImageStyle} />
            : <Image source={require('../assets/icons/heart-gray.png')} style={styles.heart as ImageStyle} />
          }
        </View>
      )
    }

    const scrollToToday = () => {
      if (scrollViewRef.current) {
        const offset = today.date * 55 - 165 //daily-box width
        scrollViewRef.current.scrollTo({ x: offset, animated: true })
      }
    }
  
    useEffect(() => {
      const { date, month, year, day, daysInMonth } = getCurrentDate()
      setToday({ date, month, year, day, daysInMonth })
    }, [today.date])

  return (  
    <ScrollView 
    ref={scrollViewRef}
    horizontal
    style={styles.dailyContainer}
    onContentSizeChange={scrollToToday} // default position
    onMomentumScrollEnd={scrollToToday}
    scrollEventThrottle={200}
    decelerationRate="fast"
  >
    {dailyContainer}
  </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  dailyContainer: {
    height: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.pink,
    backgroundColor: Colors.lightestPink
  },
  dailyBox: {
    width: 55,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRightWidth: 3,
    borderColor: 'white'
  },
  dailyText: {
    fontWeight: 'bold'
  },
  heart: {
    width: 30,
    height: 30,
    opacity: 0.5,
    position: 'absolute',
    bottom: 5,
    left: 10,
  },
})

export default ScrollCalendar