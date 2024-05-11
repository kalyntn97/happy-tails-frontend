//npm
import { useState } from "react"
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native"
//types & helpers
import { Visit } from "@health/HealthInterface"
import { countDaysBetween } from "@utils/datetime"
import { useGetHealthById } from "@health/healthQueries"
import { HEALTHS } from "@health/healthHelpers"
//queries & hooks
import { useDeleteHealthCard, useShallowPetColor } from "@hooks/sharedHooks"
import { getActionIconSource, getHealthIconSource } from "@utils/ui"
//components
import Loader from "@components/Loader"
import PetInfo from "@components/PetInfo/PetInfo"
import NoteInput from "@health/components/NoteInput"
import { BoxHeader } from "@components/UIComponents"
import { StatButton, TransparentButton } from "@components/ButtonComponent"
//styles
import { styles } from "@styles/DetailsScreenStyles"
import { Colors, Forms, Typography } from "@styles/index"


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
  const petIdToColor = useShallowPetColor()
  let petColor: string, iconSource: any, daysToDue: number, daysFromDone: number
  
  if (isSuccess) {
    petColor = Colors.multi.light[petIdToColor(health.pet._id)]
    iconSource = getHealthIconSource(health.name)
    health.lastDone.sort((a: Visit, b: Visit) => new Date(b.date).getTime() - new Date(a.date).getTime())
    daysToDue = countDaysBetween('today', health.nextDue.date)
    daysFromDone = countDaysBetween(health.lastDone[0].date, 'today')
  }

  const VisitItem = ({ visit, due }: VisitItem) => (
    <View style={[
      styles.doneCon, { borderColor: due ? petColor : Colors.shadow.reg },
      due && { backgroundColor: petColor }
    ]}>
      <View style={styles.rowCon}>
        <Image source={getActionIconSource(due ? 'due': 'done')} style={styles.itemIcon} />
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
      style={[
        isSuccess && { backgroundColor: Colors.multi.lightest[petIdToColor(health.pet._id)] },
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
            <Text style={styles.header}>{ HEALTHS[health.name] ?? health.name }</Text>
            <View style={styles.petCon}>
              <PetInfo pet={health.pet} size='small' />
            </View>
            <View style={styles.itemInfo}>
              <View style={styles.rowCon}>
                <Image source={getActionIconSource('due')} style={styles.itemIcon} />
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
              <StatButton item={{ header: 'done', stat: daysFromDone, body: 'days ago' }} bgColor={Colors.multi.light[petIdToColor(health.pet._id)]} />
              <StatButton item={{ header: daysToDue >= 0 ? 'due in' : 'past due', stat: Math.abs(daysToDue), body: 'days' }} color={daysToDue < 0 && Colors.red.reg} bgColor={Colors.multi.light[petIdToColor(health.pet._id)]} />
              <StatButton item={{ header: 'total', stat: health.lastDone.length, body: 'visits' }} bgColor={Colors.multi.light[petIdToColor(health.pet._id)]} />
            </View>
            <View style={{...Forms.roundedCon}}>
              <BoxHeader title='Update' titleIconSource={getActionIconSource('editSquare')} onPress={() => navigation.navigate('Edit', { health: health })} />
              <BoxHeader title="Delete" titleIconSource={getActionIconSource('deleteSquare')} onPress={() => showDeleteConfirmDialog(health, handleDeleteHealthCard)} titleColor={Colors.red.reg} />
            </View>
          </View>
          <View style={{...Forms.roundedCon}}>
            <BoxHeader title='All logs' titleIconSource={getActionIconSource('noteSquare')}/>
            {health.lastDone.length > 1 && 
              <TouchableOpacity style={styles.showButton} onPress={() => setShowAllVisits(!showAllVisits)}>
                <Text style={{...Typography.xSmallSubHeader}}>{showAllVisits ? 'Hide ': 'Show all'} ({health.lastDone.length + 1})</Text>
              </TouchableOpacity>
            }
            <View style={styles.pastVisitCon}>
              <VisitItem visit={health.nextDue} due={true} /> 
              { health.lastDone.length > 0 ?
                <>
                  {showAllVisits ? 
                    health.lastDone.map((visit: Visit) => <VisitItem key={visit._id} visit={visit} />)
                  : 
                    health.lastDone.slice(0, 1).map((visit: Visit) => <VisitItem key={visit._id} visit={visit} />)
                  }

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