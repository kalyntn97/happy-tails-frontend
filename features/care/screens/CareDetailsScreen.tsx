//npm
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, ImageStyle, ScrollView } from "react-native"
//types & helpers
import { Care } from "@care/careService"
import * as careHelpers from '@care/careHelpers'
import { useCareActions } from "@store/store"
//components
import ScrollPetList from "@components/PetInfo/ScrollPetList"
import DailyChart from "@components/Charts/DailyChart"
import BarChart from "@components/Charts/BarChart"
import YearChart from "@components/Charts/YearChart"
import FillChart from "@components/Charts/FillChart"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface CareDetailsProps {
  navigation: any
  route: { params: { care: Care }}
}

const CareDetailsScreen = ({ navigation, route }) => {

  const { care: careCard } = route.params
  
  const { onDeleteCare } = useCareActions()

  const iconSource = careHelpers.getIconSource(careCard.name)

  const handleDeleteCareCard = async (careId: string) => {
    await onDeleteCare!(careId)
    navigation.navigate('Index')
  }

  const showDeleteConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      `Remove ${careCard.name} Tracker ?`, 
      [
        { text: 'Yes', onPress: () => { handleDeleteCareCard(careCard._id) }},
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