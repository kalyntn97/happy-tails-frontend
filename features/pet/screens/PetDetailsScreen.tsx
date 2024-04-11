//npm modules
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, useWindowDimensions } from "react-native"
//types & context
import { Pet } from "@pet/PetInterface"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import Loader from "@components/Loader"
import {  BoxHeader } from "@components/HeaderComponent"
import { AlertForm } from "@utils/ui"

//store & queries
import { useDeletePet } from "@pet/petQueries"
import { usePetActions } from "@store/store"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'
import { useCaresByPet, useHealthDueByPet } from "@home/hooks"

interface PetDetailsProps {
  navigation: any
  route: { params: { pet: Pet } }
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  const { pet } = route.params

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
      style={{ backgroundColor: Colors.multi.light[pet.color] }}
    >
      {pet ?
        <>
          <View style={[styles.infoCard, 
          ]}>
            <View style={styles.petInfo}>
              <PetInfo pet={pet} size='expanded' />
            </View>

          </View>

          <View style={{ ...Forms.roundedCon }}>
            <BoxHeader title="Update info" onPress={() => navigation.navigate('Edit', { pet })} />
            <BoxHeader title='Log pet stats' onPress={() => navigation.navigate('Create', { pet: { _id: pet._id, name: pet.name } })} />
            <BoxHeader title={deletePetMutation.isPending ? 'Deleting...' : 'Delete'} onPress={showDeleteConfirmDialog} titleColor={Colors.red.dark} />
          </View>
        </>
        : <Loader />
      }
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
})
export default PetDetailsScreen