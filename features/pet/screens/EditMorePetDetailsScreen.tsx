import React, { FC } from 'react'
//components
import IdForm from '@pet/components/IdForm'
import HealthConditionForm from '@pet/components/HealthConditionForm'
import MedicationForm from '@pet/components/MedicationForm'
import ServiceForm from '@pet/components/ServiceForm'
import { ScrollScreen } from '@components/UIComponents'
//utils
import { DetailType } from '@pet/PetInterface'
import { useAddPetDetail } from '@pet/petQueries'
import AllergyForm from '@pet/components/AllergyForm'

interface EditMorePetDetailsScreenProps {
  route: { params: { type: string, petId: string } }
} 

const EditMorePetDetailsScreen = ({ route }: EditMorePetDetailsScreenProps) => {
  const { type, petId } = route.params
  const addDetailMutation = useAddPetDetail(petId)

  const handleSubmit = (type: DetailType, formData: any) => {
    addDetailMutation.mutate({ type, formData })
  }

  return (
    <ScrollScreen>
      { type === 'id' && <IdForm onSubmit={handleSubmit} isPending={addDetailMutation.isPending} /> }  
      { type === 'medication' && <MedicationForm onSubmit={handleSubmit} isPending={addDetailMutation.isPending} /> }
      { type === 'service' && <ServiceForm onSubmit={handleSubmit} isPending={addDetailMutation.isPending} /> }
      { type === 'condition' && <HealthConditionForm onSubmit={handleSubmit} /> }
      { type === 'allergy' && <AllergyForm onSubmit={handleSubmit} /> }
    </ScrollScreen>
  )
}

export default EditMorePetDetailsScreen