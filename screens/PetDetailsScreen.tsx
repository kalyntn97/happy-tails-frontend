//npm modules
import { useCallback, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native"
//types & context
import { Pet } from "../services/petService"
import { usePetContext } from "../context/PetContext"
//components
import PetInfo from "../components/PetInfo"
//services
import * as petService from '../services/petService'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface PetDetailsProps {
  navigation: any
  route: { params: { petId: string }}
}

const PetDetailsScreen: React.FC<PetDetailsProps> = ({ navigation, route }) => {
  const [pet, setPet] = useState<Pet>({
    _id: '',
    name: '',
    age: 0,
    species: '',
    breed: '',
    photo: '',
  })
  const { petId } = route.params
  const { onDeletePet } = usePetContext()
  
  const handleDeletePet = async (petId: string) => {
    const result = await onDeletePet!(petId)
    console.log('result', result)

    if (result && result.error) {
      alert(result.msg)
    }
    navigation.navigate('Pets')
  }
  
  const showDeleteConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      `Remove ${pet.name} from your profile?`, 
      [
        { text: 'Yes', onPress: () => { handleDeletePet(petId) }},
        { text: 'No' }
      ]
    )
  }

  useFocusEffect(
    useCallback(() => {
      const fetchPetDetails = async () => {
        const petData = await petService.show(petId)
        setPet(petData)
      }
      fetchPetDetails()
    }, [petId])
  )

  return ( 
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <View style={styles.petInfo}>
          <PetInfo pet={pet} size='expanded' />
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={{...styles.mainBtn, backgroundColor: Colors.yellow}}
            onPress={() => navigation.navigate('Edit', {pet})}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.mainBtn, backgroundColor: Colors.red}} onPress={showDeleteConfirmDialog}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
    ...Spacing.fullWH,
  },
  infoCard: {
    width: '90%',
    height: '40%',
    ...Forms.card,
    backgroundColor: Colors.lightestPink,
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