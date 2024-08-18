//components
import CareForm from "../components/CareForm"
//hooks & utils
import { CareFormData } from "@care/CareInterface"
import { useAddCare } from "@care/careQueries"

const NewCareScreen = ({ navigation }) => {
  const addCareMutation = useAddCare(navigation)

  const handleSubmit = (formData: CareFormData) => addCareMutation.mutate(formData)

  return (
    <CareForm onSubmit={handleSubmit} navigation={navigation} status={addCareMutation.status} />
  )
}

export default NewCareScreen