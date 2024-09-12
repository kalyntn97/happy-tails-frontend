//npm modules
import LottieView from 'lottie-react-native'
import { useRef } from "react"
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
//context
import { useAuth } from "@auth/AuthContext"
//types & helpers
import type { TabScreenNavigationProp } from "@navigation/types"
import { centerHeight, windowHeight } from "@utils/constants"
//components
import { SubButton, TransparentButton } from "@components/ButtonComponents"
import FloatingButton from "@components/FloatingButton/FloatingButton"
import HomeFeed from "@home/components/HomeFeed"
import ScrollCalendar from "@home/components/ScrollCalendar"
//styles
import { Buttons, Colors } from '@styles/index'

type Props = {
  navigation: TabScreenNavigationProp<'Feed'>
}

const HomeScreen = ({ navigation }: Props) => {
  const { authState } = useAuth()
  const height = useWindowDimensions().height

  const scrollViewRef = useRef<ScrollView>(null)

  const scrollToNext = (pageNum: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: pageNum * windowHeight, animated: true })
    }
  }

  return ( 
    <View style={{ minHeight: height }}>
      <StatusBar barStyle="dark-content" />
      { authState.authenticated ? 
        <SafeAreaView style={{ backgroundColor: Colors.shadow.lightest, height: '100%' }}>
          <ScrollCalendar />
          <View style={styles.body}>
            <HomeFeed navigation={navigation} />
          </View>
          <FloatingButton />
        </SafeAreaView>
      : <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
        >
          <View style={[styles.screen, { height: height, backgroundColor: Colors.white }]}>
            <LottieView source={require('@assets/animations/happy.json')} autoPlay loop style={styles.homeAnimation} />
            <View style={styles.header}>
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
      </ScrollView> }
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  body: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.white,
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