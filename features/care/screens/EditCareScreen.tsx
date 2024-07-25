//npm
import { useEffect, useState } from "react"
import { useIsFocused } from "@react-navigation/native"
import { TouchableOpacity, Text, StyleSheet, View } from "react-native"
//components
import CareForm from "../components/CareForm"
import Loader from "@components/Loader"
//types
import { Care, CareFormData, InitialCare } from "@care/CareInterface"
import { Pet } from "@pet/PetInterface"
//store
import { useUpdateCare } from "@care/careQueries"
import { AlertForm } from "@utils/ui"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

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
    <View style={{ flex : 1, backgroundColor: Colors.multi.lightest[color] }}>
      {care ? 
        <CareForm onSubmit={handleSubmit} initialValues={initialValues} navigation={navigation} status={updateCareMutation.status} setColor={setColor} />
        : <Loader />
      }
    </View>
  )
}

export default EditCareScreen