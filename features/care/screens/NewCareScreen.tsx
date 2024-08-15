import { useIsFocused } from "@react-navigation/native"
import { useEffect, useState } from "react"
//components
import { useAddCare } from "@care/careQueries"
import CareForm from "../components/CareForm"
import { ScrollScreen } from "@components/UIComponents"
//styles
import { Colors } from '@styles/index'

const NewCareScreen = ({ navigation }) => {
  const [color, setColor] = useState<number>(0)

  const isFocused = useIsFocused()
  const addCareMutation = useAddCare(navigation)

  const handleSubmit = (formData: CareFormData) => {
    addCareMutation.mutate(formData)
  }

  useEffect(() => {
    if (!isFocused) {
      navigation.goBack()
    }
  }, [navigation, isFocused])

  return (
    <ScrollScreen bgColor={Colors.multi.lightest[color]}>
      <CareForm onSubmit={handleSubmit} navigation={navigation} status={addCareMutation.status} setColor={setColor} />
    </ScrollScreen>  
  )
}

export default NewCareScreen