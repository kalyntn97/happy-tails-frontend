//npm
import { useState, useEffect } from "react"
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView, TouchableOpacity } from "react-native"
//types & helpers
import { Pet } from "@pet/PetInterface"
import { Care } from "@care/CareInterface"
import * as careHelpers from "@care/careHelpers"
//services
import * as careService from '@care/careService'
//components
import ScrollPetList from "@components/PetInfo/ScrollPetList"
import TrackerPanel from "./TrackerPanel"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'


interface CareCardProps {
  care: Care
  onNavigate?: (value: React.SetStateAction<boolean>) => void
  navigation: any
}

const CareCard = ({ care, navigation, onNavigate }) => {
  const iconSource = careHelpers.getIconSource(care.name)
  const [careCard, setCareCard] = useState<Care>(care)

  const latestTracker = careCard.trackers[careCard.trackers.length - 1]
  const { isCurrent } = careHelpers.getDateTimeFromTracker(latestTracker.name)

  const handleNavigate = () => {
    onNavigate && onNavigate()
    navigation.navigate('Care', { screen: 'Details' , params : { care: care } })
  }
  
  useEffect(() => {
    const autoUpdateCareCard = async () => {
      if ( !isCurrent ) {
        const data = await careService.autoCreateTracker(careCard._id)
        setCareCard(data)
      }
    }
    autoUpdateCareCard()
  }, [isCurrent, latestTracker])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[
          styles.colorBox,
          { backgroundColor: careHelpers.getTaskBackgroundColor(care.frequency) }
        ]}>
          <View style={styles.titleContainer}>
            <Image source={iconSource} style={styles.icon } />
            <View style={styles.titleContent}>
              <Text style={styles.title}>{care.name}</Text>
              <Text style={styles.freq}>
                {care.times} times / {care.frequency === 'Daily' ? 'day' : care.frequency === 'Weekly' ? 'week' : care.frequency === 'Monthly' ? 'month' : 'year'}
              </Text>
            </View>
          </View>
        </View>
        
        <ScrollPetList petArray={care.pets} size='small' navigation={navigation}/>
      </View>
      
      <View style={styles.body}>
        <View style={styles.currentTracker}>
          <TrackerPanel care={care} />
        </View>
        <TouchableOpacity style={styles.mainBtn} onPress={handleNavigate}>
          <Text style={styles.btnText}>View History</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    backgroundColor: Colors.white,
    ...Forms.card,
    width: '90%',
    height: 370,
    marginBottom: 40,
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    height: '50%',
    ...Spacing.flexColumn,
  },
  colorBox: {
    height: 70,
    width: '90%',
    marginTop: -40,
    borderRadius: 8,
    ...Forms.boxShadow,
  },
  titleContainer: {
    height: 70,
    width: '100%',
    ...Spacing.flexRow,
    justifyContent: 'space-around'
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