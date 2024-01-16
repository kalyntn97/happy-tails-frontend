//npm
import { useState, useEffect } from "react"
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView, TouchableOpacity } from "react-native"
//types
import { Pet } from "../services/petService"
import { Care } from "../services/careService"
//utils & services
import * as careUtils from "../utils/careUtils"
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
  const [index, setIndex] = useState<number>(0)

  const iconSource = careUtils.getIconSource(care.name)
  
  useEffect(() => {
    // update as index (day, week) change
    console.log('carecard trackers', care.trackers)
    const updateIndex = () => {
      const updatedIdx = careUtils.getIndex(care.frequency)
      setIndex(updatedIdx)
    }
    updateIndex()
  }, [index])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.colorBox}>
          <View style={styles.titleContainer}>
            <Image source={iconSource} style={styles.icon as ImageStyle} />
            <View style={styles.titleContent}>
              <Text style={styles.title}>{care.name}</Text>
              <Text style={styles.freq}>{care.times} / {care.frequency}</Text>
            </View>
          </View>
        </View>
        {/* <ScrollView>
          <View style={styles.petList}>
            {care.pets.map(pet =>               <View style={styles.petInfo}>
                <PetInfo pet={pet} size='small' />
              </View>
            )}
          </View>
        </ScrollView> */}
        <View style={styles.petList}>
          <ScrollPetList petArray={care.pets} size='small' />
        </View>
      </View>
      
      <View style={styles.body}>
        <View style={styles.currentTracker}>
          <TrackerPanel careId={care._id} currTracker={care.trackers[care.trackers.length - 1]} freq={care.frequency} times={care.times} index={index} />
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
  petlist: {
    height: 100,
    width: '100%',
    ...Spacing.centered
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