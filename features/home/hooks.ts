//npm
import { Alert } from "react-native"
//queries
import { useDeleteCare } from "../care/careQueries"
import { useDeleteHealth } from "@health/healthQueries"
//types & helpers
import { AlertForm } from "@utils/ui"
import { useShallowPetBasics } from "@store/storeUtils"

const showDeleteConfirmDialog = (item: any, handleDeleteItem: (itemId: string) => void) => {
  return Alert.alert(
    'Are you sure?',
    `Remove ${item.name} Tracker ?`, 
    [
      { text: 'Yes', onPress: () => { handleDeleteItem(item._id) }},
      { text: 'No' }
    ]
  )
}

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

  return { handleDeleteCareCard, showDeleteConfirmDialog }
}

export const useDeleteHealthCard = (navigation: any) => {
  const deleteHealthMutation = useDeleteHealth()

  const handleDeleteHealthCard = async (healthId: string) => {
    deleteHealthMutation.mutate(healthId, {
      onSuccess: () => {
        navigation.navigate('Main')
        return AlertForm({ body: `Deleted successfully`, button: 'OK' })
      },
      onError: (error) => {
        return AlertForm({ body: `Error: ${error}`, button: 'Retry' })
      },
    })
  }

  return { handleDeleteHealthCard, showDeleteConfirmDialog }
}

export const useShallowPetColor = () => {
  const pets = useShallowPetBasics()
  const petIdToColor = (petId: string) => {
    if (pets.length) {
      return pets.find(pet => pet._id === petId).color
    }
  }
  
  return { petIdToColor }
}