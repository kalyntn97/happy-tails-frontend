//npm
import { FC, useState } from "react"
import { Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker'
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


export const useSelectPhoto = async  () => {
  let _image = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4,3],
    quality: 1,
  })
  console.log(JSON.stringify(_image))

  if (!_image.canceled) {
    return _image.assets[0].uri
  }
}