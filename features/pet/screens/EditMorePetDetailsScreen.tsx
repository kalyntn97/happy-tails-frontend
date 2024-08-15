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
  navigation: any
} 

const EditMorePetDetailsScreen: FC<EditMorePetDetailsScreenProps> = ({ route, navigation }) => {
  const { type, petId } = route.params
  const addDetailMutation = useAddPetDetail(petId, navigation)

  const handleSubmit = (type: DetailType, formData: any) => {
    addDetailMutation.mutate({ type, formData })
  }

  return (
    <ScrollScreen>
      {type === 'ids' && <IdForm onSubmit={handleSubmit} />} 
      {type === 'meds' && <MedicationForm onSubmit={handleSubmit} />}
      {type === 'services' && <ServiceForm onSubmit={handleSubmit} />}
      {type === 'illnesses' && <IllnessForm onSubmit={handleSubmit} />}
    </ScrollScreen>
  )
}

export default EditMorePetDetailsScreen