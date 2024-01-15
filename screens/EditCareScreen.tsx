//npm
import { StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
import { Care } from "../services/careService"
import { Pet } from "../services/petService"

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const { care } = route.params

  const initialValues: {
    name: string, frequency: string, times: number, pets: string[]
  } = {
    name: care.name, frequency: care.frequency, times: care.times, pets: care.pets
  }

  const editCare = () => {
    
  }

  return (  
    <CareForm onSubmit={handleEditCare} initialValues={initialValues}/>
  )
}

export default EditCareScreen