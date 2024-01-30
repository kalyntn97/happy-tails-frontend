//npm modules
import { useRef, useState, useEffect } from "react"
import { View, Text, Pressable, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView, Image, ImageStyle } from "react-native"
import LottieView from 'lottie-react-native'
//context
import { useAuth } from "../context/AuthContext"
import { useProfileContext } from "../context/ProfileContext"
//components
import CareFeed from "../components/CareFeed"
//utils & services
import * as careUtils from '../utils/careUtils'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import { usePetContext } from "../context/PetContext"

const HomeScreen: React.FC = ({ navigation }) => {
  const { authState } = useAuth()
  const { profile } = useProfileContext()
  const [today, setToday] = useState({ currDate: 1, currMonth: 'January', currYear: 2024, currWeek: 1 })

  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const centerHeight = windowHeight - 191
  const scrollViewRef = useRef<ScrollView>(null)
  
  const scrollToNext = (pageNum: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: pageNum * windowHeight, animated: true })
    }
  }

  useEffect(() => {
    const fetchToday = () => {
      const { date, month, year, week } = careUtils.getCurrentDate()
      const currMonth = careUtils.getMonth(month)
      setToday({ currDate: date, currMonth: currMonth, monthIdx: month, currYear: year, currWeek: week })
    }
    fetchToday()
  }, [authState, profile])

  return ( 
    <>
      {authState?.authenticated ? (
        <>
          {profile && 
            <View style={[styles.screen, { minHeight: centerHeight }]}>
              <Image source={require('../assets/images/happy-tails-banner.png')} style={{ width: '100%', maxHeight: windowHeight * 0.2 }} />
              <Text style={[styles.date, { height: centerHeight * 0.05 }]}>{today.currMonth} {today.currDate} {today.currYear}</Text>
              <CareFeed today={today} navigation={navigation}/>
            </View>
          }
        </>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
          style={{ width: windowWidth }}
        >
          <View style={[styles.screen, { height: windowHeight }]}>
            <LottieView source={require('../assets/animations/happy.json')} autoPlay loop style={styles.happyAnimation} />
            <View style={styles.headers}>
                <Text style={styles.mainHeader}>
                  <Text style={{ color: Colors.blue }}>Care.</Text>{'\n'}
                  <Text style={{ color: Colors.green }}>Connection.</Text>{'\n'}
                  <Text style={{ color: Colors.pink }}>Joy.</Text>
                </Text>
                <Text style={styles.subHeader}>Ready to start a new journey with your furry friends?</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('User', { screen: 'Login' })} style={styles.mainBtn}>
              <Text style={[styles.btnText, { color: Colors.lightestPink }]}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(1)}>
              <LottieView source={require('../assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.lightPink }]}>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(2)}>
              <LottieView source={require('../assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.yellow }]}>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(0)}>
              <LottieView source={require('../assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  banner: {
    
  },
  date: {
    ...Typography.smallSubHeader,
  },
  headers:{
    width: '80%',
    marginHorizontal: 10
  },
  mainHeader: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 20
  },
  happyAnimation: {
    width: '100%',
    marginVertical: 20,
  },
  mainBtn: {
    ...Buttons.longRounded,
    width: '80%',
    height: 50,
    backgroundColor: Colors.pink,
    marginTop: 10,
    
  },
  btnText: {
    ...Buttons.buttonText,
    fontSize: 20,
  },
  link: {
    ...Buttons.base,
    marginTop: 'auto'
  },
  icon: {
    width: 100, 
    height: 100,
  }
})
 
export default HomeScreen