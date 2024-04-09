//npm
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, Alert, Image, ImageStyle, ScrollView } from "react-native"
//types & helpers & queries
import { Care, Tracker } from "@care/CareInterface"
import { useDeleteCareCard } from "@home/hooks"
import { getCurrentTrackerIndex } from "@care/careHelpers"
//components
import { getCareIconSource } from "@utils/ui"
import PetList from "@components/PetInfo/PetList"
import DailyChart from "@components/Charts/DailyChart"
import BarChart from "@components/Charts/BarChart"
import YearChart from "@components/Charts/YearChart"
import FillChart from "@components/Charts/FillChart"
import Loader from "@components/Loader"
import { BoxHeader, BoxWithHeader } from "@components/HeaderComponent"
import { StatButton } from "@components/ButtonComponent"
//styles
import { styles } from "@styles/DetailsScreenStyles"
import { Colors, Forms } from '@styles/index'

interface CareDetailsProps {
  navigation: any
  route: { params: { care: Care }}
}

const CareDetailsScreen = ({ navigation, route }) => {

  const { care } = route.params
  const { showDeleteConfirmDialog, handleDeleteCareCard } = useDeleteCareCard(navigation)
  const trackers = care.trackers.reverse()
  const taskIndex = getCurrentTrackerIndex(care.frequency)
  
  const iconSource = getCareIconSource(care.name)

  
  return (
    <ScrollView
      style={[styles.scrollView,
        { backgroundColor: Colors.multi.lightest[care.color]}
      ]}
      contentContainerStyle={styles.scrollContent}
      scrollEventThrottle={200}
      decelerationRate="fast" 
    >
      {care ?
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{care.name}</Text>
            <View style={[styles.itemInfo]}>
              <View style={styles.rowCon}>
                <Image source={require('@assets/icons/calendar-due.png')} style={styles.itemIcon}/>
                <Text style={styles.subHeader}>
                  {new Date(care.date).toLocaleDateString()}
                  {care.endDate &&
                    <Text> - {new Date(care.endDate).toLocaleDateString()}</Text>
                  }
                </Text>
              </View>
              <View style={styles.rowCon}>
                <Image source={iconSource} style={styles.itemIcon} />
                <Text style={styles.subHeader}>
                  {care.times} times / {
                    care.frequency === 'Daily' ? 'day' 
                    : care.frequency === 'Weekly' ? 'week' 
                    : care.frequency === 'Monthly' ? 'month' 
                    : 'year'
                  }
                </Text>
              </View>
              {/* <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>Go back</Text>
              </TouchableOpacity> */}
            </View>
          
            <PetList petArray={care.pets} size='small' />

            <View style={{...Forms.rowCon}}>
              <StatButton item={{ header: 'streak', stat: 0, body: 'days' }} />
              <StatButton item={{ header: 'current', stat: trackers[0].done[taskIndex], body: `of ${care.times}` }} />
              <StatButton item={{ header: 'longest', stat: 0, body: 'days' }} />
            </View>
          </View>

          <View style={{ ...Forms.roundedCon}}>
            <BoxHeader title='Update' onPress={() => navigation.navigate('Edit', { care: care })} />
            <BoxHeader title='Delete' onPress={() => showDeleteConfirmDialog(care, handleDeleteCareCard)} titleColor={Colors.red.reg} />
          </View>

          <BoxWithHeader 
            title='History'
            content={
              trackers.map((tracker: Tracker, idx: number) =>
                <React.Fragment key={`tracker-${idx}`}>
                  {care.frequency === 'Daily' 
                  ? <DailyChart key={`Daily-${idx}`} tracker={tracker} times={care.times} />
                  : care.times === 1 && care.frequency !== 'Yearly'
                  ? <FillChart key={`1X-${idx}`} tracker={tracker} frequency={care.frequency} times={care.times} />
                  : ( care.frequency === 'Weekly' || care.frequency === 'Monthly' ) 
                    ? <BarChart key={`${care.frequency}-${idx}`} tracker={tracker} frequency={care.frequency} times={care.times} />
                    : <YearChart key={`Yearly-${idx}`} tracker={tracker} times={care.times} />
                  }
                </React.Fragment>
              )
            }
          />
        </> 
        : <Loader />
      }

    </ScrollView> 
  )
}



export default CareDetailsScreen