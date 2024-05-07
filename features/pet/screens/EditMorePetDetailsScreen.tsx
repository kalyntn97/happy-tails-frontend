import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import IdForm from '@pet/components/IdForm'
import MedicationForm from '@pet/components/MedicationForm'
import ServiceForm from '@pet/components/ServiceForm'
import DiseaseForm from '@pet/components/DiseaseForm'
import { useAddId, useAddService } from '@pet/petQueries'
import { AlertForm } from '@utils/ui'

interface EditMorePetDetailsScreenProps {
  route: { params: { form: string, petId: string } }
  navigation: any
} 



const EditMorePetDetailsScreen: FC<EditMorePetDetailsScreenProps> = ({ route, navigation }) => {
  const { form, petId } = route.params
  const addIdMutation = useAddId(petId, navigation)
  const addServiceMutation = useAddService(petId, navigation)

  const handleSubmit = (type: string, formData: any) => {
    switch (type) {
      case 'id': return addIdMutation.mutate(formData)
      case 'service': return addServiceMutation.mutate(formData)
    }
  }

  return (
    <ScrollView>
      {form === 'id' && <IdForm onSubmit={handleSubmit} />} 
      {form === 'med' && <MedicationForm />}
      {form === 'service' && <ServiceForm onSubmit={handleSubmit} />}
      {form === 'disease' && <DiseaseForm />}
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  
})

export default EditMorePetDetailsScreen