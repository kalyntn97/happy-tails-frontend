//npm
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
import Colors from "@styles/colors"
import { useState } from "react"

interface HealthDetailsProps {
  navigation: any
  route: { params: { health: Health }}
}

const HealthDetailsScreen = ({ navigation, route }) => {
  const { health } = route.params
  const { showDeleteConfirmDialog, handleDeleteHealthCard } = useDeleteHealthCard(navigation)
  const { petIdToColor } = useShallowPetColor()
  const iconSource = getIconSource(health.name)

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      scrollEventThrottle={200}
      decelerationRate="fast" 
    >
      {health ?
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
                  <Text style={styles.subHeader}>{new Date(health.nextDue).toLocaleDateString()}</Text>
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
          
            <View style={styles.btnContainer}>
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.yellow }]} onPress={() => navigation.navigate('Edit', { health: health })}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.red }]} onPress={() => showDeleteConfirmDialog(health, handleDeleteHealthCard)}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

            
          <View style={styles.pastVisitCon}>
            { health.lastDone.length ? 
              health.lastDone.map((visit: Visit) =>
                <View key={visit._id} style={[styles.doneCon, {
                  backgroundColor: Colors.multiArray3[petIdToColor(health.pet._id)]
                }]}>
                  <View style={styles.rowCon}>
                    <Image source={require('@assets/icons/done.png')} style={styles.itemIcon} />
                    <Text style={styles.detailText}>{new Date(visit.date).toLocaleDateString()}</Text>
                  </View>
                  <NoteInput healthId={health._id} visit={visit} />
                </View>
              )
            : 
              <View>
                <Text style={styles.msg}>No past visits...</Text> 
              </View>
            }
          </View>
        </> 
        : <Loader />
      }
    </ScrollView> 
  )
}
 
export default HealthDetailsScreen