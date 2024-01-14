//npm
import { StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
import { Care } from "../services/careService"

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const { care } = route.params

  const initialValues: {
    name: string, frequency: string, times: number
  } = {
    name: care.name, frequency: care.frequency, times: care.times
  }

  const handleEditCare = () => {
    
  }

  return (  
    <CareForm onSubmit={handleEditCare} initialValues={initialValues}/>
  )
}

export default EditCareScreen