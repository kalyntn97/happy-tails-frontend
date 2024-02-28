//npm modules
import { useCallback, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native"
//types & context
import { Pet } from "@pet/PetInterface"
//components
import PetInfo from "@components/PetInfo/PetInfo"
//store
import { usePetActions } from "@store/store"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface PetDetailsProps {
  navigation: any
  route: { params: { pet: Pet } }
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  // const [pet, setPet] = useState<Pet>({
  //   _id: '',
  //   name: '',
  //   age: 0,
  //   species: '',
  //   breed: '',
  //   photo: '',
  // })
  const { pet } = route.params
  // const { data: pet, isLoading, refetch, isError, isSuccess } = useGetPetById(petId)
  const { onDeletePet } = usePetActions()
  
  const handleDeletePet = async (petId: string) => {
    await onDeletePet!(petId)
    navigation.navigate('Index')
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
    <View style={styles.container}>
      {pet && 
        <View style={styles.infoCard}>
          <View style={styles.petInfo}>
            <PetInfo pet={pet} size='expanded' />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity 
              style={{...styles.mainBtn, backgroundColor: Colors.yellow}}
              onPress={() => navigation.navigate('Edit', { pet: pet })}
            >
              <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.mainBtn, backgroundColor: Colors.red}} onPress={showDeleteConfirmDialog}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      {/* {isLoading && <Text>Fetching data...</Text>} */}
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown
  },
  infoCard: {
    width: '90%',
    height: '40%',
    ...Forms.card,
    backgroundColor: Colors.white,
    justifyContent: 'flex-start'
  },
  petInfo: {
    width: '100%',
    height: '60%'
  },
  btnContainer: {
    width: '100%',
    height: '30%',
    ...Spacing.flexRow,
    justifyContent: 'space-between'
  },
  mainBtn: {
    ...Buttons.xSmallRounded,
  },
  btnText: {
    ...Buttons.buttonText
  },
})
export default PetDetailsScreen