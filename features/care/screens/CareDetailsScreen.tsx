//npm
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, ImageStyle, ScrollView } from "react-native"
//types & helpers & queries
import { Care, Tracker } from "@care/CareInterface"
//components
import { AlertForm, getIconSource } from "@utils/ui"
import ScrollPetList from "@components/PetInfo/ScrollPetList"
import DailyChart from "@components/Charts/DailyChart"
import BarChart from "@components/Charts/BarChart"
import YearChart from "@components/Charts/YearChart"
import FillChart from "@components/Charts/FillChart"
import Loader from "@components/Loader"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { useDeleteCareCard } from "@care/careHooks"

interface CareDetailsProps {
  navigation: any
  route: { params: { care: Care }}
}

const CareDetailsScreen = ({ navigation, route }) => {

  const { care: careCard } = route.params
  const { showDeleteConfirmDialog } = useDeleteCareCard(navigation)
  const trackers = careCard.trackers.reverse()
  
  const iconSource = getIconSource(careCard.name)

  
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      scrollEventThrottle={200}
      decelerationRate="fast" 
    >
      {careCard ?
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{careCard.name}</Text>
            <View style={styles.careInfo}>
              <View style={styles.rowCon}>
                <Image source={require('@assets/icons/date.png')} style={styles.careIcon}/>
                <Text style={styles.subHeader}>
                  {new Date(careCard.date).toLocaleDateString()}
                  {careCard.endDate &&
                    <Text> - {new Date(careCard.endDate).toLocaleDateString()}</Text>
                  }
                </Text>
              </View>
              <View style={styles.rowCon}>
                <Image source={iconSource} style={styles.careIcon} />
                <Text style={styles.subHeader}>
                  {careCard.times} times / {
                    careCard.frequency === 'Daily' ? 'day' 
                    : careCard.frequency === 'Weekly' ? 'week' 
                    : careCard.frequency === 'Monthly' ? 'month' 
                    : 'year'
                  }
                </Text>
              </View>
              {/* <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>Go back</Text>
              </TouchableOpacity> */}
            </View>
          
            <ScrollPetList petArray={careCard.pets} size='small' />

            <View style={styles.btnContainer}>
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.yellow }]} onPress={() => navigation.navigate('Edit', { care: careCard })}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.red }]} onPress={() => showDeleteConfirmDialog(careCard)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          {trackers.map((tracker: Tracker, idx: number) =>
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
        </> 
        : <Loader />
      }

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
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  careIcon: {
    ...Forms.smallIcon,
  },
  subHeader: {
    ...Typography.smallSubHeader,
  },
  rowCon: {
    ...Spacing.flexRow,
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