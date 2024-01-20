//npm modules
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LottieView from "lottie-react-native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
//components
import CareCard from "../components/CareCard"
import CareForm from "../components/CareForm"
import ToggleableForm from "../components/ToggleableForm"
//services & utils
import { Care } from "../services/careService"
import * as careService from '../services/careService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

type CareIndexProps = {
  navigation: DrawerNavigationProp<{}>
  route: { params?: { careId?: string }}
}

const CareIndexScreen: React.FC<CareIndexProps> = ({ navigation, route }) => {
  const [careCards, setCareCards] = useState<Care[]>([])

  useEffect(() => {
    const fetchCareCards = async () => {
      const data = await careService.index()
      setCareCards(data)
    }
    fetchCareCards()
  }, [route.params?.careId])

  return (
    <View style={styles.container}>
      {!careCards.length &&
        <View style={styles.empty}>
          <LottieView source={require('../assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
          <Text style={styles.msg}>Start managing your pet's health</Text>
        </View>
      }
      <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.btnText}>Add a tracker</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        // showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        decelerationRate="fast" 
      > 

        {careCards.map((careCard, idx) => 
          <CareCard key={careCard._id} care={careCard} navigation={navigation}/>
        )}
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  scrollView: {
    width: '100%',
  },
  empty: {
    
  },
  msg: {
    ...Typography.subHeader,
    color: Colors.darkPink,
    marginTop: 50
  },
  catAnimation: {
    width: '100%'
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  mainBtn: {
    ...Buttons.longSquare,
    backgroundColor: Colors.pink,
  },
  btnText: {
    ...Buttons.buttonText
  },
})
 
export default CareIndexScreen