//npm modules
import { useCallback, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native"
//types & context
import { Pet } from "@pet/PetInterface"
//components
import PetInfo from "@components/PetInfo/PetInfo"
import Loader from "@components/Loader"
//store & queries
import { useDeletePet } from "@pet/petQueries"
import { usePetActions } from "@store/store"
import { AlertForm } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'
import { BoxWithHeader, BoxStyles, BoxHeader } from "@components/HeaderComponent"
import { StatButton } from "@components/ButtonComponent"

interface PetDetailsProps {
  navigation: any
  route: { params: { pet: Pet } }
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  const { pet } = route.params
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
    <View style={[styles.container, { backgroundColor: Colors.multiArray3[pet.color] }]}>
      {pet ?
        <>
          <View style={[styles.infoCard, 
          ]}>
            <View style={styles.petInfo}>
              <PetInfo pet={pet} size='expanded' />
            </View>
            <View style={{...Forms.rowCon}}>
              <StatButton item={ {header: 'vet visit', stat: 100, body: 'days'}} color={Colors.multiArray3[pet.color]} />
              <StatButton item={ {header: 'tasks', stat: 1, body: 'today'}} color={Colors.multiArray3[pet.color]} />
              <StatButton item={ {header: 'status', iconUri: require('@assets/icons/very-good.png'), body: '12/30/24'}} color={Colors.multiArray3[pet.color]} />
            </View>

          </View>

          <View style={{ ...Forms.roundedCon }}>
            <BoxHeader title="Update info" onPress={() => navigation.navigate('Edit', { pet: pet })} />
            <BoxHeader title={deletePetMutation.isPending ? 'Deleting...' : 'Delete'} onPress={showDeleteConfirmDialog} />
          </View>
        </>
      
        : <Loader />
      }
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
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