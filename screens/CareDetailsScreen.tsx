//npm
import React, { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, ImageStyle, ScrollView } from "react-native"
//services & utils
import { Care } from "../services/careService"
import * as careService from '../services/careService'
import * as careUtils from '../utils/careUtils'
//context
import { useCareContext } from "../context/CareContext"
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
  const { onDeleteCare } = useCareContext()

  const iconSource = careUtils.getIconSource(careCard.name)

  useEffect(() => {
    const fetchCareDetails = async () => {
      const data = await careService.show(careId)
      setCareCard(data)
    }
    fetchCareDetails()
  }, [careId])

  const handleDeleteCareCard = async (careId: string) => {
    await onDeleteCare!(careId)
    navigation.navigate('Index')
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
        <Text style={styles.header}>{careCard.name}</Text>
        <View style={styles.careInfo}>
          <Image source={iconSource} style={styles.careIcon} />
          <Text style={styles.freq}>
            {careCard.times} times / {
              careCard.frequency === 'Daily' ? 'day' 
              : careCard.frequency === 'Weekly' ? 'week' 
              : careCard.frequency === 'Monthly' ? 'month' 
              : 'year'
            }
          </Text>
          <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      
        <ScrollPetList petArray={careCard.pets} size='small' />

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
  },
  header: {
    ...Typography.subHeader,
    color: Colors.darkPink,
  },
  careInfo: {
    ...Spacing.flexRow,
    width: '80%',
  },
  careIcon: {
    ...Forms.smallIcon,
  },
  freq: {
    ...Typography.smallSubHeader,
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
    marginLeft: 'auto',
  },
  btnText: {
    ...Buttons.buttonText
  },
  icon: {
    ...Forms.largeIcon
  },
})

export default CareDetailsScreen