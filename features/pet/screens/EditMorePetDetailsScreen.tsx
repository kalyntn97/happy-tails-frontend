import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import IdForm from '@pet/components/IdForm'
import MedicationForm from '@pet/components/MedicationForm'
import ServiceForm from '@pet/components/ServiceForm'
import IllnessForm from '@pet/components/IllnessForm'
import { useAddPetDetail } from '@pet/petQueries'
import { AlertForm } from '@utils/ui'
import { DetailType } from '@pet/PetInterface'

interface EditMorePetDetailsScreenProps {
  route: { params: { type: string, petId: string } }
  navigation: any
} 

const EditMorePetDetailsScreen: FC<EditMorePetDetailsScreenProps> = ({ route, navigation }) => {
  const { type, petId } = route.params

  const addDetailMutation = useAddPetDetail(petId, navigation)

  const handleSubmit = (type: DetailType, formData: any) => {
    addDetailMutation.mutate({ type, formData })
  }

  return (
    <ScrollView>
      {type === 'ids' && <IdForm onSubmit={handleSubmit} />} 
      {type === 'meds' && <MedicationForm onSubmit={handleSubmit} />}
      {type === 'services' && <ServiceForm onSubmit={handleSubmit} />}
      {type === 'illnesses' && <IllnessForm onSubmit={handleSubmit} />}
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  
})

export default EditMorePetDetailsScreen