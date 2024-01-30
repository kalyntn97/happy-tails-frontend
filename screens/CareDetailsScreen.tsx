//npm
import React, { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, ImageStyle, ScrollView } from "react-native"
//services & utils
import { Care } from "../services/careService"
import * as careService from '../services/careService'
import * as careUtils from '../utils/careUtils'
//components
import ScrollPetList from "../components/ScrollPetList"
import DailyChart from "../components/DailyChart"
import BarChart from "../components/BarChart"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import YearChart from "../components/YearChart"
import FillChart from "../components/FillChart"

interface CareDetailsProps {
  navigation: any
  route: { params: { careId: string }}
}

export const testCare = {
  _id: '1', name: 'Nail Clipping', frequency: 'Weekly', times: 3, 
  pets: [
    {_id: "65989b22aab8137117ea79e2", age: 3, breed: "Ragdoll", name: "Luna Stella Reyes-Nguyen", photo: "https://res.cloudinary.com/davz8l292/image/upload/v1704500003/happy-tails/zl1mn2rhuqa1x5keabda.jpg", species: "Cat",}, 
    {_id: "65989b998504f2bca8d477ac", age: 3, breed: "British Shorthair", name: "Levi Milo Reyes-Nguyen", photo: "https://res.cloudinary.com/davz8l292/image/upload/v1704500133/happy-tails/vce2esffuxeqtxhsvcnt.jpg", species: "Cat",}
  ],
  trackers: [
    {_id: '1', name: '12-2023', done: [2, 1, 0, 3, 0], total: 5 },
    {_id: '2', name: '1-2024', done: [1,0,0,0,0], total: 5 },
  ]
  
}

const CareDetailsScreen = ({ navigation, route }) => {
  const [careCard, setCareCard] = useState<Care>({
    _id: '',
    name: '',
    frequency: 'Daily',
    times: 0,
    pets: [],
    trackers: []
  })

  const { careId } = route.params

  const iconSource = careUtils.getIconSource(careCard.name)

  useEffect(() => {
    const fetchCareDetails = async () => {
      const data = await careService.show(careId)
      console.log(data)
      setCareCard(data)
    }
    fetchCareDetails()
  }, [careId])

  const handleDeleteCareCard = async (careId: string) => {
    const deletedCareCard = await careService.deleteCareCard(careId)
    navigation.navigate('Index', { careId: deletedCareCard._id })
  }

  const showDeleteConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      `Remove ${careCard.name} Tracker ?`, 
      [
        { text: 'Yes', onPress: () => { handleDeleteCareCard(careId) }},
        { text: 'No' }
      ]
    )
  }

  return (  
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      scrollEventThrottle={200}
      decelerationRate="fast" 
    >
      <View style={styles.headerContainer}>
        {/* <Image source={iconSource} style={styles.icon as ImageStyle} /> */}
        <Text style={styles.header}>{careCard.name}</Text>
        <View style={styles.petContainer}>
          <ScrollPetList petArray={careCard.pets} size='small' />

          <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Go back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.yellow }]} onPress={() => navigation.navigate('Edit', { care: careCard })}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.red }]} onPress={showDeleteConfirmDialog}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {careCard.trackers.map((tracker, idx) =>
        <React.Fragment key={`tracker-${idx}`}>
          {careCard.frequency === 'Daily' 
          ? <DailyChart key={`Daily-${idx}`} tracker={tracker} times={careCard.times} />
          : careCard.times === 1 && careCard.frequency !== 'Yearly'
          ? <FillChart key={`1X-${idx}`} tracker={tracker} frequency={careCard.frequency} times={careCard.times} />
          : ( careCard.frequency === 'Weekly' || careCard.frequency === 'Monthly' ) 
            ? <BarChart key={`${careCard.frequency}-${idx}`} tracker={tracker} frequency={careCard.frequency} times={careCard.times} />
            : <YearChart key={`Yearly-${idx}`} tracker={tracker} times={careCard.times} />
          }
        </React.Fragment>
      )}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  scrollContent: {
    alignItems: 'center'
  },
  headerContainer: {
    ...Spacing.flexColumn,
    width: '100%',
    // height: '20%'
  },
  header: {
    ...Typography.subHeader,
    color: Colors.darkPink,
  },
  petContainer: {
    ...Spacing.flexColumn,
    width: "100%",
  },
  btnContainer: {
    ...Spacing.flexRow,
    marginVertical: 10
  },
  mainBtn: {
    ...Buttons.xSmallSquare
  },
  subBtn: {
    ...Buttons.smallSub,
  },
  btnText: {
    ...Buttons.buttonText
  },
  icon: {
    ...Forms.largeIcon
  },
})

export default CareDetailsScreen