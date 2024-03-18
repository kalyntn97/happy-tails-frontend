//npm modules
import { useRef, useState, useEffect } from "react"
import { View, Text, Pressable, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView, Image, ImageStyle, SafeAreaView, StatusBar, Alert } from "react-native"
import LottieView from 'lottie-react-native'
//context
import { useAuth } from "@auth/AuthContext"
//components
import HomeFeed from "@home/components/HomeFeed"
import FloatingButton from "@components/FloatingButton/FloatingButton"
import ScrollCalendar from "@home/components/ScrollCalendar"
import Loader from "@components/Loader"
//utils & services
import { getCurrentDate } from "@utils/datetime"
//styles
import { Buttons, Typography, Colors, Forms, Spacing } from '@styles/index'

const HomeScreen: React.FC = ({ navigation }) => {
  const { authState } = useAuth()

  const windowWidth = useWindowDimensions().width
  const windowHeight = useWindowDimensions().height
  const centerHeight = windowHeight - 191
  const scrollViewRef = useRef<ScrollView>(null)
  
  const scrollToNext = (pageNum: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: pageNum * windowHeight, animated: true })
    }
  }
 
  return ( 
    <View>
      <StatusBar barStyle="dark-content" />
      {authState.authenticated ? (
        <>
          <View style={[styles.screen, { minHeight: centerHeight }]}>
            <View style={{ height: windowHeight * 0.22, justifyContent: 'flex-end' }}>
              <ScrollCalendar />
            </View>
            {/* <Image source={require('@assets/images/happy-tails-banner.png')} style={[styles.banner, { width: windowWidth, height: windowHeight * 0.2 }]} /> */}
            <View style={[styles.body, { height: windowHeight * 0.7 }]}>
              <HomeFeed navigation={navigation} />
            </View>
            <FloatingButton navigation={navigation} />
          </View>
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
          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.white }]}>
            <LottieView source={require('@assets/animations/happy.json')} autoPlay loop style={styles.happyAnimation} />
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
              <LottieView source={require('@assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.lightPink }]}>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(2)}>
              <LottieView source={require('@assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>

          <View style={[styles.screen, { height: windowHeight, backgroundColor: Colors.yellow }]}>
            <TouchableOpacity style={styles.link} onPress={() => scrollToNext(0)}>
              <LottieView source={require('@assets/animations/downArrow.json')} autoPlay loop style={styles.icon}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.lightPink,
  },
  banner: {
    marginTop: 40,
  },
  body: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.white,
    alignItems: 'center',
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
  emptyMsgBtn: {
    ...Spacing.flexRow,
  },
  btnText: {
    ...Buttons.buttonText,
    fontSize: 20,
  },
  msgIcon: {
    ...Forms.smallIcon,
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [{rotate: '-30deg'}]
  },
  msg: {
    ...Typography.xSmallHeader,
  },
  emptyMsgContainer: {
    ...Spacing.flexColumn,
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