//npm
import { useState, useEffect, FC } from "react"
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView, TouchableOpacity } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import { CARES, getCareIcon } from "@care/careHelpers"
import { getActionIconSource } from "@utils/ui"
//components
import PetList from "@components/PetInfo/PetList"
import TrackerPanel from "./TrackerPanel"
import { CloseButton, TransparentButton } from "@components/ButtonComponent"
//styles
import { styles } from "@styles/stylesheets/ModalCardStyles"
import { Colors, Spacing, UI, Typography } from "@styles/index"

interface CareCardProps {
  care: Care
  onNavigate?: () => void
  navigation: any
}

const CareCard: FC<CareCardProps> = ({ care, navigation, onNavigate }) => {
  const iconSource = getCareIcon(care.name)
  const handleNavigate = () => {
    onNavigate()
    navigation.navigate('CareDetails', { care })
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.multi.lightest[care.color] }]}>
      <CloseButton onPress={() => onNavigate()} size='small' position="topRight" />
      <View style={styles.header}>
        <Image source={iconSource} style={styles.icon } />
        <Text style={styles.title}>{CARES[care.name] ?? care.name}</Text>
      </View>

      { care.medication &&
        <View style={styles.desCon}>
          <Text style={styles.des}>
            {care.medication.name}
            {care.medication.amount && <Text> - {care.medication.amount}</Text>}
          </Text>
        </View>
      }
      <View style={styles.subHeader}>
        <PetList petArray={care.pets} size='small' />
          {care.repeat &&
            <View style={Spacing.flexRow}>
              <Image source={getActionIconSource('repeat')} style={{ ...UI.smallIcon }} />
              <Text style={styles.freq}>
                {care.times} times / {care.frequency === 'Daily' ? 'day' : care.frequency === 'Weekly' ? 'week' : care.frequency === 'Monthly' ? 'month' : 'year'}
              </Text>
            </View>
          }
      </View>
      
      <TrackerPanel care={care} />
      
      {care.repeat &&
        <TransparentButton size='small' title='See more' onPress={handleNavigate} top={20} />
      }
    </View>
  )
}

export default CareCard