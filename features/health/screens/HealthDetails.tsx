//npm
import { FC, useState } from "react"
import { Image, ScrollView, Text, View, TouchableOpacity, Pressable, useWindowDimensions } from "react-native"
//types
import { Health, Visit } from "@health/HealthInterface"
//queries & hooks
import { useDeleteHealthCard, useShallowPetColor } from "@home/hooks"
import { getIconSource } from "@utils/ui"
//components
import Loader from "@components/Loader"
import PetInfo from "@components/PetInfo/PetInfo"
import NoteInput from "@health/components/NoteInput"
//styles
import { styles } from "@styles/DetailsScreenStyles"
import { Colors, Forms, Typography } from "@styles/index"
import { BoxHeader, BoxWithHeader } from "@components/HeaderComponent"
import { StatButton, TransparentButton } from "@components/ButtonComponent"
import { countDaysBetween } from "@utils/datetime"
import { useGetHealthById } from "@health/healthQueries"


interface HealthDetailsProps {
  navigation: any
  route: { params: { healthId: string }}
}

type VisitItem = {
  visit: Visit
  due?: boolean
}

const HealthDetailsScreen = ({ navigation, route }) => {
  const { data: health, isSuccess, isLoading, isError } = useGetHealthById(route.params.healthId)
  const [showAllVisits, setShowAllVisits] = useState(false)

  const { showDeleteConfirmDialog, handleDeleteHealthCard } = useDeleteHealthCard(navigation)
  const { petIdToColor } = useShallowPetColor()
  let petColor: string, lastDoneReversed: Visit[], iconSource: any, daysToDue: number, daysFromDone: number
  
  if (isSuccess) {
    petColor = Colors.multiArray3[petIdToColor(health.pet._id)]
    
    lastDoneReversed= [...health.lastDone].reverse() ?? []
    iconSource = getIconSource(health.name)
    daysToDue = countDaysBetween(new Date(), health.nextDue.date)
    daysFromDone = countDaysBetween(lastDoneReversed[0]?.date, new Date())
  }

  const VisitItem = ({ visit, due }: VisitItem) => (
    <View style={[
      styles.doneCon, { borderColor: due ? petColor : Colors.shadow },
      due && { backgroundColor: petColor }
    ]}>
      <View style={styles.rowCon}>
        <Image source={due ? require('@assets/icons/due.png') : require('@assets/icons/done.png')} style={styles.itemIcon} />
        <View>
          <Text style={styles.detailText}>{new Date(visit.date).toLocaleDateString()}</Text>   
          {due && 
          <Text style={[styles.visitStatus, daysToDue < 0 && styles.pastDue]}>{daysToDue >= 0 ? `Due in ${daysToDue} days` : `Due ${Math.abs(daysToDue)} days ago`}</Text>
          }
        </View>

      </View>
      <NoteInput healthId={health._id} visit={visit} due={due} />
    </View>
  )

  return (
    <ScrollView
      style={[styles.scrollView,
        isSuccess && { backgroundColor: Colors.multiArray4[petIdToColor(health.pet._id)] },
      ]}
      contentContainerStyle={styles.scrollContent}
      scrollEventThrottle={200}
      decelerationRate="fast" 
    >
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching data... </Text> }
      { isSuccess &&
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{health.name}</Text>
            <View style={styles.petCon}>
              <PetInfo pet={health.pet} size='small' />
            </View>
            <View style={styles.itemInfo}>
              <View style={styles.rowCon}>
                <Image source={require('@assets/icons/due.png')} style={styles.itemIcon} />
                {health.nextDue &&
                  <Text style={styles.subHeader}>{new Date(health.nextDue.date).toLocaleDateString()}</Text>
                }
              </View>
              <View style={styles.rowCon}>
                <Image source={iconSource} style={styles.itemIcon} />
                <Text style={styles.subHeader}>
                  Every {health.times} {health.frequency}
                </Text>
              </View>
              {/* <TouchableOpacity style={styles.subBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.btnText}>Go back</Text>
              </TouchableOpacity> */}
            </View>
          
            <View style={{...Forms.rowCon}}>
              <StatButton item={{ header: 'done', stat: daysFromDone, body: 'days ago' }} bgColor={Colors.multiArray3[petIdToColor(health.pet._id)]} />
              <StatButton item={{ header: daysToDue >= 0 ? 'due in' : 'past due', stat: Math.abs(daysToDue), body: 'days' }} color={daysToDue < 0 && Colors.red} bgColor={Colors.multiArray3[petIdToColor(health.pet._id)]} />
              <StatButton item={{ header: 'total', stat: health.lastDone.length, body: 'visits' }} bgColor={Colors.multiArray3[petIdToColor(health.pet._id)]} />
            </View>
            <View style={{...Forms.roundedCon}}>
              <BoxHeader title='Update' onPress={() => navigation.navigate('Edit', { health: health })} />
              <BoxHeader title="Delete" onPress={() => showDeleteConfirmDialog(health, handleDeleteHealthCard)} titleColor={Colors.red} />
            </View>
          </View>
          <View style={{...Forms.roundedCon}}>
            <BoxHeader title='All logs' />
            <TouchableOpacity style={styles.showButton} onPress={() => setShowAllVisits(!showAllVisits)}>
              <Text style={{...Typography.xSmallSubHeader}}>{showAllVisits ? 'Hide ': 'Show all'} ({lastDoneReversed.length + 1})</Text>
            </TouchableOpacity>
            <View style={styles.pastVisitCon}>
              <VisitItem visit={health.nextDue} due={true} /> 
              { lastDoneReversed.length ? 
                <>
                  { lastDoneReversed.map((visit: Visit, index: number) => {
                    if (showAllVisits) {
                      return <VisitItem key={visit._id} visit={visit} />
                    } else {
                      return index < 1 && <VisitItem key={visit._id} visit={visit} />
                    }
                  })}
                  {showAllVisits && 
                    <TransparentButton title='Hide' onPress={() => setShowAllVisits(false)} size="small" />
                  }
                </>
              : 
                <View style={styles.doneCon}>
                  <Text style={styles.msg}>No previous visits</Text> 
                </View>
              }
            </View>
          </View>

        </> 
      }
    </ScrollView> 
  )
}
 
export default HealthDetailsScreen