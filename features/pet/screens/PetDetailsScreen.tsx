//npm modules
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, useWindowDimensions, Pressable } from "react-native"
//types & context
import { Pet } from "@pet/PetInterface"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import Loader from "@components/Loader"
import {  BoxHeader, BoxWithHeader } from "@components/UIComponents"
import { AlertForm, getActionIconSource, getStatIconSource } from "@utils/ui"

//store & queries
import { useDeletePet, useGetPetById } from "@pet/petQueries"
import { usePetActions } from "@store/store"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'
import { useCaresByPet, useHealthDueByPet } from "@home/hooks"
import StatDetails from "@stat/screens/StatDetails"
import { STATS } from "@stat/statHelpers"
import { Stat } from "@stat/statInterface"
import { Image } from "react-native"
import { CloseButton, IconButton } from "@components/ButtonComponent"
import { useState } from "react"

interface PetDetailsProps {
  navigation: any
  route: { params: { pet: Pet } }
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  
  const {data: pet, isSuccess, isLoading, isError} = useGetPetById(route.params.pet._id, route.params.pet)
  const [showMsg, setShowMsg] = useState<boolean>(true)
  const windowHeight = useWindowDimensions().height

  const { onDeletePet } = usePetActions()
  const deletePetMutation = useDeletePet()
  
  const handleDeletePet = async (petId: string) => {
    deletePetMutation.mutate(petId, {
      onSuccess: (data) => {
        onDeletePet(data)
        navigation.navigate('Index')
        return AlertForm({ body: 'Pet deleted successfully', button: 'OK' })
      }, 
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      }
    })
  }
  
  const showDeleteConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      `Remove ${pet.name} from your profile?`, 
      [
        { text: 'Yes', onPress: () => { handleDeletePet(pet._id) }},
        { text: 'No' }
      ]
    )
  }

  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: Colors.multi.lightest[pet.color] }}
    >
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching pets...</Text> }
      
      <View style={[styles.infoCard, 
      ]}>
        <View style={styles.petInfo}>
          <PetInfo pet={pet} size='expanded' />
        </View>

      </View>

      <View style={styles.sectionHeaderCon}>
        <Image source={getActionIconSource('saveSquare')} style={{ ...Forms.smallIcon }} />
        <Text style={styles.sectionHeader}>Important</Text>
      </View>
      <View style={{ ...Forms.roundedCon }}>
        {!pet.ids.length && !pet.medications.length && !pet.services.length && !pet.diseases.length && showMsg &&
          <View>
            <Pressable style={{ ...Spacing.flexRow, width: '100%', padding: 5 }} onPress={() => navigation.navigate('PetDetails', { pet })}>
              <CloseButton size="xSmall" onPress={() => setShowMsg(false)} />
              <Text style={{ ...Typography.xSmallSubBody, marginLeft: 5 }}>Enter details such as microchip, medications, allergies, any health conditions, and contacts.</Text>
            </Pressable>
          </View>
        }
        {pet.ids.length > 0 && <BoxHeader title='Identifications' titleIconSource={getActionIconSource('id')} mode="light" onPress={() => navigation.navigate('PetDetails', { pet, show: 'id' })} />}
        {pet.medications.length > 0 && <BoxHeader title='Medications' titleIconSource={getActionIconSource('med')} mode="light" />}
        {pet.diseases.length > 0 &&
          <>
            <BoxHeader title='Allergies' titleIconSource={getActionIconSource('allergy')} mode="light" />
            <BoxHeader title='Health conditions' titleIconSource={getActionIconSource('disease')} mode="light" />
          </>
        }  
        {pet.services.length > 0 && <BoxHeader title='Services' titleIconSource={getActionIconSource('service')} mode="light" />}
      </View>

      {isSuccess && pet.stats.length > 0 &&
        <>
          <View style={styles.sectionHeaderCon}>
            <Image source={getActionIconSource('chart')} style={{ ...Forms.smallIcon }} />
            <Text style={styles.sectionHeader}>Logs</Text>
          </View>
          <View style={{ ...Forms.roundedCon }}>
            { pet.stats.map((stat: any, index: number) =>
              <BoxHeader key={index} mode='light' onPress={() => navigation.navigate('Stat', { stat })} 
                title={STATS[stat.name]?.name}
                titleIconSource={getStatIconSource(stat.name)}
              />
            )}
          </View>
        </>
      }

      <View style={styles.sectionHeaderCon}>
        <Image source={getActionIconSource('actionSquare')} style={{ ...Forms.smallIcon }} />
        <Text style={styles.sectionHeader}>Actions</Text>
      </View>
      <View style={{ ...Forms.roundedCon }}>
        <BoxHeader title='Log pet stats' titleIconSource={getActionIconSource('log')} mode='light' onPress={() => navigation.navigate('Create', { pet: { _id: pet._id, name: pet.name } })} />
        <BoxHeader title="Update pet info" titleIconSource={getActionIconSource('editSquare')} mode='light' onPress={() => navigation.navigate('Pets', { screen: 'Edit', params: { pet: pet } })} />
        <BoxHeader title={deletePetMutation.isPending ? 'Deleting...' : 'Delete pet profile'} titleIconSource={getActionIconSource('deleteSquare')} onPress={showDeleteConfirmDialog} titleColor={Colors.red.dark} />
      </View>

    </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    paddingVertical: 20,
    marginTop: 20,
  },
  infoCard: {
    width: '90%',
    height: 290,
    ...Forms.card,
    justifyContent: 'flex-start',
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  petInfo: {
    width: '100%',
    height: '60%'
  },
  sectionHeader: {
    ...Typography.xSmallHeader,
    marginVertical: 0,
    marginLeft: 10,
  },
  sectionHeaderCon: {
    ...Spacing.flexRow,
    width: '90%',
    marginBottom: 0,
    marginTop: 10,
  },
})
export default PetDetailsScreen