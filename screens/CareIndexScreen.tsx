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

export const care1 = {
  name: 'Teeth Brushing',
  pets: [
    {name: 'Luna Stella Reyes-Nguyen', age: 3, breed: 'Ragdoll', species: 'Cat', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500003/happy-tails/zl1mn2rhuqa1x5keabda.jpg'},
    {name: 'Levi Milo Reyes-Nguyen', age: 3, breed: 'British Shorthair', species: 'Cat', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500133/happy-tails/vce2esffuxeqtxhsvcnt.jpg'},
  ],
  times: 3,
  frequency: 'weekly',
  trackers: [{name: '1-2024', total: 5, done: [2], skipped: 0, left: 4}]
}

export const care2 = {
  name: 'Daily Walks',
  pets: [
    {name: 'Leroy Pupi Reyes-Nguyen', age: 1, breed: 'Samoyed', species: 'Dog', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500284/happy-tails/x2qghqghxfpf88ofbw7m.jpg'},
  ],
  times: 3,
  frequency: 'daily',
  trackers: [{name: '1-2024', total: 31, done: [3, 3, 3, 3, 3, 3, 3], skipped: 0, left: 24}]
}

export const care3 = {
  name: 'Grooming',
  pets: [
    {name: 'Leroy Pupi Reyes-Nguyen', age: 1, breed: 'Samoyed', species: 'Dog', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500284/happy-tails/x2qghqghxfpf88ofbw7m.jpg'},
  ],
  times: 4,
  frequency: 'yearly',
  trackers: [{name: '2024', total: 4, done: [1, 1], skipped: 0, left: 2}]
}

export const care4 = {
  name: 'Litter Box Cleaning',
  pets: [
    {name: 'Luna Stella Reyes-Nguyen', age: 3, breed: 'Ragdoll', species: 'Cat', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500003/happy-tails/zl1mn2rhuqa1x5keabda.jpg'},
    {name: 'Levi Milo Reyes-Nguyen', age: 3, breed: 'British Shorthair', species: 'Cat', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500133/happy-tails/vce2esffuxeqtxhsvcnt.jpg'},
  ],
  times: 1,
  frequency: 'daily',
  trackers: [{name: '1-2024', total: 31, done: [1, 1, 1, 1, 1, 1, 1], skipped: 0, left: 24}]
}

const CareIndexScreen: React.FC = ({ navigation }) => {
  const [careCards, setCareCards] = useState<Care[]>([])

  useEffect(() => {
    const fetchCareCards = async () => {
      const data = await careService.index()
      console.log(data)
      setCareCards(data)
    }
    fetchCareCards()
  }, [])

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