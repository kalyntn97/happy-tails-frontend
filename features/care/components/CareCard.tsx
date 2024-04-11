//npm
import { useState, useEffect, FC } from "react"
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView, TouchableOpacity } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { CARES } from "@care/careHelpers"
import { getActionIconSource, getCareIconSource } from "@utils/ui"
//components
import PetList from "@components/PetInfo/PetList"
import TrackerPanel from "./TrackerPanel"
import { CloseButton, TransparentButton } from "@components/ButtonComponent"
//styles
import { styles } from "@styles/ModalCardStyles"
import { Colors, Spacing, Forms } from "@styles/index"

interface CareCardProps {
  care: Care
  onNavigate?: () => void
  navigation: any
}

const CareCard: FC<CareCardProps> = ({ care, navigation, onNavigate }) => {
  const iconSource = getCareIconSource(care.name)
  
  const handleNavigate = () => {
    onNavigate()
    navigation.navigate('Care', { screen: 'Details' , params : { care }, initial: false })
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.multi.lightest[care.color] }]}>
      <CloseButton onPress={() => onNavigate()} size='small' position="topRight" />
      <View style={styles.header}>
        <Image source={iconSource} style={styles.icon } />
        <Text style={styles.title}>{CARES[care.name] ?? care.name}</Text>
      </View>

      <View style={styles.subHeader}>
        <PetList petArray={care.pets} size='small' navigation={navigation}/>
          {care.repeat &&
            <View style={{ ...Spacing.flexRow }}>
              <Image source={getActionIconSource('repeat')} style={{ ...Forms.smallIcon }} />
              <Text style={styles.freq}>
                {care.times} times / {care.frequency === 'Daily' ? 'day' : care.frequency === 'Weekly' ? 'week' : care.frequency === 'Monthly' ? 'month' : 'year'}
              </Text>
            </View>
          }
      </View>
      
      <View style={styles.currentTracker}>
        <TrackerPanel care={care} />
      </View>
      
      {care.repeat &&
        <TransparentButton size='small' title='See more' onPress={handleNavigate} color={Colors.shadow.darkest} top='auto' />
      }
    </View>
  )
}

export default CareCard