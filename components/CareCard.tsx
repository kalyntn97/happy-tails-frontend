//npm
import { useState, useEffect } from "react"
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView, TouchableOpacity } from "react-native"
//types
import { Pet } from "../services/petService"
import { Care } from "../services/careService"
//utils & services
import * as careUtils from "../utils/careUtils"
import * as careService from '../services/careService'
//components
import PetInfo from "./PetInfo"
import ScrollPetList from "./ScrollPetList"
import TrackerPanel from "./TrackerPanel"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'


interface CareCardProps {
  care: Care
  navigation: any
}

const CareCard = ({ care, navigation }) => {
  const iconSource = careUtils.getIconSource(care.name)
  const [careCard, setCareCard] = useState<Care>(care)

  const latestTracker = careCard.trackers[careCard.trackers.length - 1]
  const { isCurrent } = careUtils.getDateTimeFromTracker(latestTracker.name)
  console.log('checking if new month or year has passed...', !isCurrent)
  
  useEffect(() => {
    const autoUpdateCareCard = async () => {
      if ( !isCurrent ) {
        const data = await careService.autoCreateTracker(careCard._id)
        console.log('updated CareCard data', data)
        setCareCard(data)
      }
    }
    autoUpdateCareCard()
  }, [isCurrent, careCard._id])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.colorBox}>
          <View style={styles.titleContainer}>
            <Image source={iconSource} style={styles.icon as ImageStyle} />
            <View style={styles.titleContent}>
              <Text style={styles.title}>{care.name}</Text>
              <Text style={styles.freq}>
                {care.times} times / {care.frequency === 'Daily' ? 'day' : care.frequency === 'Weekly' ? 'week' : care.frequency === 'Monthly' ? 'month' : 'year'}
              </Text>
            </View>
          </View>
        </View>
        
        <ScrollPetList petArray={care.pets} size='small' />
      </View>
      
      <View style={styles.body}>
        <View style={styles.currentTracker}>
          <TrackerPanel care={care} />
        </View>
        <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Details', { careId: care._id })}>
          <Text style={styles.btnText}>View History</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    backgroundColor: Colors.lightPink,
    ...Forms.card,
    width: '90%',
    height: 370,
    marginBottom: 40,
    alignItems: 'center'
  },
  header: {
    width: '100%',
    height: '50%',
    ...Spacing.flexColumn,
  },
  colorBox: {
    height: 70,
    width: '80%',
    backgroundColor: Colors.yellow,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: -40
  },
  titleContainer: {
    height: 70,
    width: '100%',
    ...Spacing.flexRow,
    alignItems: 'center',
  },
  titleContent: {
    ...Spacing.flexColumn,
  },
  title: {
    ...Typography.smallHeader,
    marginVertical: 0,
    color: Colors.darkPink
  },
  icon: {
    ...Forms.icon
  },
  body: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    marginTop: -40
  },
  currentTracker: {
    width: '90%',
    height: 150,
  },
  freq: {
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 20
  },
  btnText: {
    ...Buttons.buttonText
  },
  mainBtn: {
    ...Buttons.smallSub
  }
})
 
export default CareCard