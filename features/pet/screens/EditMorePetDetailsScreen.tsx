import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import IdForm from '@pet/components/IdForm'
import MedicationForm from '@pet/components/MedicationForm'
import ServiceForm from '@pet/components/ServiceForm'
import IllnessForm from '@pet/components/IllnessForm'
import { useAddId, useAddIllness, useAddPetDetail, useAddService } from '@pet/petQueries'
import { AlertForm } from '@utils/ui'

interface EditMorePetDetailsScreenProps {
  route: { params: { form: string, petId: string } }
  navigation: any
} 



const EditMorePetDetailsScreen: FC<EditMorePetDetailsScreenProps> = ({ route, navigation }) => {
  const { form, petId } = route.params

  const addDetailMutation = useAddPetDetail(petId, navigation)

  const handleSubmit = (type: string, formData: any) => {
    addDetailMutation.mutate({ key: type, formData })
  }

  return (
    <ScrollView>
      {form === 'id' && <IdForm onSubmit={handleSubmit} />} 
      {form === 'med' && <MedicationForm />}
      {form === 'service' && <ServiceForm onSubmit={handleSubmit} />}
      {form === 'illness' && <IllnessForm onSubmit={handleSubmit} />}
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  
})

export default EditMorePetDetailsScreen