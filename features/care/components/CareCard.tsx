//npm
import { useState, useEffect, FC } from "react"
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView, TouchableOpacity } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import * as careHelpers from "@care/careHelpers"
import { getIconSource } from "@utils/ui"
//components
import PetList from "@components/PetInfo/PetList"
import TrackerPanel from "./TrackerPanel"
//styles
import { styles } from "@styles/ModalCardStyles"

interface CareCardProps {
  care: Care
  onNavigate?: () => void
  navigation: any
}

const CareCard: FC<CareCardProps> = ({ care, navigation, onNavigate }) => {
  const iconSource = getIconSource(care.name)
  
  const handleNavigate = () => {
    onNavigate && onNavigate()
    navigation.navigate('Care', { screen: 'Details' , params : { care }, initial: false })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[
          styles.colorBox,
          { backgroundColor: careHelpers.getTaskBackgroundColor(care.frequency) }
        ]}>
          <View style={styles.titleContainer}>
            <Image source={iconSource} style={styles.icon } />
            <View style={styles.columnCon}>
              <Text style={styles.title}>{care.name}</Text>
              {care.repeat &&
                <Text style={styles.freq}>
                  {care.times} times / {care.frequency === 'Daily' ? 'day' : care.frequency === 'Weekly' ? 'week' : care.frequency === 'Monthly' ? 'month' : 'year'}
                </Text>
              }
            </View>
          </View>
        </View>
        
        <PetList petArray={care.pets} size='small' navigation={navigation}/>
      </View>
      
      <View style={styles.body}>
        <View style={styles.currentTracker}>
          <TrackerPanel care={care} />
        </View>
        {care.repeat &&
          <TouchableOpacity style={styles.mainBtn} onPress={handleNavigate}>
            <Text style={styles.btnText}>View History</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default CareCard