//npm modules
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
//components
import CareCard from "../components/CareCard"
import CareForm from "../components/CareForm"
import ToggleableForm from "../components/ToggleableForm"
//services & utils
import { Care } from "../services/careService"
import * as careService from '../services/careService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const CareIndexScreen: React.FC = ({ navigation, route }) => {
  const [careCards, setCareCards] = useState<Care[]>([])


  useEffect(() => {
    console.log('params', route.params)
    const fetchCareCards = async () => {
      const data = await careService.index()
      setCareCards(data)
    }
    fetchCareCards()
  }, [route.params?.careId])

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.btnText}>Add a tracker</Text>
      </TouchableOpacity>

      <ScrollView
        pagingEnabled
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={200}
        decelerationRate="fast" 
      > 
        {/* <ToggleableForm title='Add a care tracker' content={<CareForm />} />
        <CareCard care={care4} />
        <CareCard care={care2} />
        <CareCard care={care1} />
        <CareCard care={care3} /> */}

        {careCards.map((careCard, idx) => 
          <CareCard key={careCard._id} care={careCard} />
        )}
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  scrollViewContent: {
    alignItems: 'center'
  },
  mainBtn: {
    ...Buttons.smallSquare,
    backgroundColor: Colors.pink,
  },
  btnText: {
    ...Buttons.buttonText
  },
})
 
export default CareIndexScreen