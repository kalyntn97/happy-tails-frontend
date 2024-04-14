//npm modules
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, useWindowDimensions } from "react-native"
//types & context
import { Pet } from "@pet/PetInterface"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import Loader from "@components/Loader"
import {  BoxHeader } from "@components/HeaderComponent"
import { AlertForm, getStatIconSource } from "@utils/ui"

//store & queries
import { useDeletePet, useGetPetById } from "@pet/petQueries"
import { usePetActions } from "@store/store"
//styles
import { Buttons, Spacing, Forms, Colors, Typography } from '@styles/index'
import { useCaresByPet, useHealthDueByPet } from "@home/hooks"
import StatDetails from "@stat/screens/StatDetails"
import { STATS } from "@stat/statHelpers"
import { Stat } from "@stat/statInterface"

interface PetDetailsProps {
  navigation: any
  route: { params: { pet: Pet } }
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  
  const {data: pet, isSuccess, isLoading, isError} = useGetPetById(route.params.pet._id, route.params.pet)

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

      {isSuccess && pet.stats.length > 0 &&
        <>
          <Text style={styles.sectionHeader}>Logs</Text>
          <View style={{ ...Forms.roundedCon }}>
            { pet.stats.map((stat: Stat, index: number) =>
              <BoxHeader key={index} mode='light' onPress={() => navigation.navigate('Stat', { stat })} 
                title={STATS[stat.name]?.name}
                titleIconSource={getStatIconSource(stat.name)}
              />
            )}
          </View>
        </>
      }

      <View style={{ ...Forms.roundedCon }}>
        <BoxHeader title='Log pet stats' onPress={() => navigation.navigate('Create', { pet: { _id: pet._id, name: pet.name } })} />
        <BoxHeader title="Update pet info" onPress={() => navigation.navigate('Edit', { pet })} />
        <BoxHeader title={deletePetMutation.isPending ? 'Deleting...' : 'Delete pet profile'} onPress={showDeleteConfirmDialog} titleColor={Colors.red.dark} />
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
    alignSelf: 'flex-start',
    marginBottom: 0,
    paddingLeft: 10,
  },
})
export default PetDetailsScreen