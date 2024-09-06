//components
import Loader from "@components/Loader"
import CareForm from "../components/CareForm"
//types
import { Care, CareFormData, InitialCare } from "@care/CareInterface"
//store
import { useUpdateCare } from "@care/careQueries"
//styles

interface EditCareProps {
  route?: { params?: { care?: Care }}
  navigation: any
}

const EditCareScreen = ({ route, navigation }: EditCareProps) => {
  const { care } = route.params
 
  const updateCareMutation = useUpdateCare(navigation)

  const initialValues: InitialCare = {
    name: care.name, pets: care.pets, repeat: care.repeat, startDate: care.startDate, endDate: care.endDate, frequency: care.frequency, color: care.color, careId: care._id
  }
  
  const handleSubmit = (formData: CareFormData) => updateCareMutation.mutate(formData)
  
  return (  
    care ? <CareForm onSubmit={handleSubmit} initialValues={initialValues} status={updateCareMutation.status} navigation={navigation} /> 
    : <Loader />
    
  )
}

export default EditCareScreen