import { useIsFocused } from "@react-navigation/native"
import { useEffect, useState } from "react"
//components
import Loader from "@components/Loader"
import CareForm from "../components/CareForm"
import { ScrollScreen } from "@components/UIComponents"
//types
import { Care, CareFormData, InitialCare } from "@care/CareInterface"
//store
import { useUpdateCare } from "@care/careQueries"
//styles
import { Colors } from '@styles/index'

interface EditCareProps {
  navigation: any
  route?: { params?: { care?: Care }}
}

const EditCareScreen: React.FC<EditCareProps> = ({ navigation, route }) => {
  const [color, setColor] = useState<number>(null)

  const { care } = route.params
  const isFocused = useIsFocused()
 
  const updateCareMutation = useUpdateCare(navigation)

  const initialValues: InitialCare = {
    name: care.name, medication: care.medication, pets: care.pets, repeat: care.repeat, ending: !!care.endDate, date: care.date, endDate: care.endDate, frequency: care.frequency, times: care.times, color: care.color, _id: care._id
  }

  const handleSubmit = async (formData: CareFormData) => {
    updateCareMutation.mutate(formData)
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
    navigation.setOptions({ headerStyle: { backgroundColor: Colors.multi.lightest[color] } })
  }, [navigation, isFocused, color])

  return (  
    care ? <CareForm onSubmit={handleSubmit} initialValues={initialValues} navigation={navigation} status={updateCareMutation.status} setColor={setColor} /> 
    : <Loader />
    
  )
}

export default EditCareScreen