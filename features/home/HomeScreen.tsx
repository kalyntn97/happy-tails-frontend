//npm modules
import { useRef } from "react"
import { View, Text, Pressable, TouchableOpacity, StyleSheet, ScrollView, Image, ImageStyle, SafeAreaView, StatusBar, Alert, Dimensions } from "react-native"
import LottieView from 'lottie-react-native'
//context
import { useAuth } from "@auth/AuthContext"
//types & helpers
import type { HomeTabScreenProps } from "@navigation/types"
import { centerHeight, windowHeight } from "./helpers"
//components
import HomeFeed from "@home/components/HomeFeed"
import FloatingButton from "@components/FloatingButton/FloatingButton"
import ScrollCalendar from "@home/components/ScrollCalendar"
import { MainButton, SubButton, TransparentButton } from "@components/ButtonComponent"
//styles
import { Buttons, Typography, Colors, Forms, Spacing } from '@styles/index'

const HomeScreen = ({ navigation }: HomeTabScreenProps) => {
  const { authState } = useAuth()

  const scrollViewRef = useRef<ScrollView>(null)
  
  const scrollToNext = (pageNum: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: pageNum * windowHeight, animated: true })
    }
  }

  return ( 
    <View>
      <StatusBar barStyle="dark-content" />
      { authState.authenticated ? 
        <View style={styles.screen}>
          <ScrollCalendar />

          <View style={[styles.body, { height: centerHeight }]}>
            <HomeFeed navigation={navigation} />
          </View>
          
          <FloatingButton navigation={navigation} />
        </View>
        
      : <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
        >
          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.white }]}>
            <LottieView source={require('@assets/animations/happy.json')} autoPlay loop style={styles.homeAnimation} />
            <View style={styles.headers}>
                <Text style={styles.mainHeader}>
                  <Text style={{ color: Colors.blue.reg }}>Care.</Text>{'\n'}
                  <Text style={{ color: Colors.green.reg }}>Connection.</Text>{'\n'}
                  <Text style={{ color: Colors.pink.reg }}>Joy.</Text>
                </Text>
                <Text style={styles.subHeader}>Ready to start a new journey with your furry friends?</Text>
            </View>
            <TransparentButton title='Get Started' onPress={() => scrollToNext(1)} color={Colors.pink.reg} bdColor={Colors.pink.reg} size='large' />
            <SubButton title="Already have an account? Login here" size='small' color={Colors.shadow.darkest} onPress={() => navigation.navigate('Login')} />
            
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(1)}>
              <LottieView source={require('@assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.pink.light }]}>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(2)}>
              <MainButton title='Continue' size='small' onPress={() => scrollToNext(2)} />
              <LottieView source={require('@assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.yellow.light }]}>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(0)}>
              <MainButton title='Continue' size='small' bgColor={Colors.yellow.dark} />
              <LottieView source={require('@assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>
      </ScrollView> }
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.shadow.lightest,
    paddingTop: 40,
  },
  header: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  body: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.white,
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
    color: Colors.shadow.darkest,
    marginBottom: 20
  },
  link: {
    ...Buttons.base,
    marginTop: 'auto'
  },
  icon: {
    width: 80, 
    height: 80,
  },
  homeAnimation: {
    width: '100%',
    aspectRatio: 1,
    marginTop: 20,
  }
})
 
export default HomeScreen