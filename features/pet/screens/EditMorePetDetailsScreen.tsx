import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import IdForm from '@pet/components/IdForm'
import MedicationForm from '@pet/components/MedicationForm'
import ServiceForm from '@pet/components/ServiceForm'
import DiseaseForm from '@pet/components/DiseaseForm'
import { useAddId } from '@pet/petQueries'
import { AlertForm } from '@utils/ui'

interface EditMorePetDetailsScreenProps {
  route: { params: { form: string, petId: string } }
  navigation: any
} 



const EditMorePetDetailsScreen: FC<EditMorePetDetailsScreenProps> = ({ route, navigation }) => {
  const { form, petId } = route.params
  const addIdMutation = useAddId(petId)

  const handleSubmit = (type: string, formData: any) => {
    switch (type) {
      case 'id': addIdMutation.mutate(formData, {
        onSuccess: () => {
          navigation.goBack()
          return AlertForm({ body: 'Id added successfully', button: 'OK' })
        },
        onError: (error) => {
          return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
        }
      })
    }
  }

  return (
    <ScrollView>
      {form === 'id' && <IdForm onSubmit={handleSubmit} />}
      {form === 'med' && <MedicationForm />}
      {form === 'service' && <ServiceForm />}
      {form === 'disease' && <DiseaseForm />}
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  
})

export default EditMorePetDetailsScreen