//npm
import { Alert } from "react-native"
//queries
import { useDeleteCare } from "./careQueries"
//types & helpers
import { Care } from "./CareInterface"
import { AlertForm } from "@utils/ui"

export const useDeleteCareCard = (navigation: any) => {
  const deleteCareMutation = useDeleteCare()

  const handleDeleteCareCard = async (careId: string) => {
    deleteCareMutation.mutate(careId, {
      onSuccess: () => {
        navigation.navigate('Main')
        return AlertForm({ body: `Deleted successfully`, button: 'OK' })
      },
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      },
    })
  }

  const showDeleteConfirmDialog = (care: Care) => {
    return Alert.alert(
      'Are you sure?',
      `Remove ${care.name} Tracker ?`, 
      [
        { text: 'Yes', onPress: () => { handleDeleteCareCard(care._id) }},
        { text: 'No' }
      ]
    )
  }

  return { handleDeleteCareCard, showDeleteConfirmDialog }
}
