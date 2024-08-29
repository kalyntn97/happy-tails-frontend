import React, { FC } from 'react'
//components
import IdForm from '@pet/components/IdForm'
import IllnessForm from '@pet/components/IllnessForm'
import MedicationForm from '@pet/components/MedicationForm'
import ServiceForm from '@pet/components/ServiceForm'
import { ScrollScreen } from '@components/UIComponents'
//utils
import { DetailType } from '@pet/PetInterface'
import { useAddPetDetail } from '@pet/petQueries'

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
      {type === 'id' && <IdForm onSubmit={handleSubmit} />} 
      {type === 'medication' && <MedicationForm onSubmit={handleSubmit} />}
      {type === 'service' && <ServiceForm onSubmit={handleSubmit} />}
      {type === 'illness' && <IllnessForm onSubmit={handleSubmit} />}
    </ScrollScreen>
  )
}

export default EditMorePetDetailsScreen