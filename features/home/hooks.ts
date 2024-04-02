//npm
import { FC, useState } from "react"
import { Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker'
//queries
import { useDeleteCare } from "../care/careQueries"
import { useDeleteHealth } from "@health/healthQueries"
//types & helpers
import { AlertForm } from "@utils/ui"
import { useShallowCares, useShallowHealths, useShallowPetBasics } from "@store/storeUtils"
import { countDaysBetween, dateIsWithinRange } from "@utils/datetime"
import { Care } from "@care/CareInterface"

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

export const useCaresByPet = (petId: string) => {
  const cares = useShallowCares()
  
  const caresByPet = () => {
    const filtered = cares.filter(care => {
      const includesPet = care.pets.map(p => p._id).includes(petId)
      const dueToday = care.frequency === 'Daily'
        && dateIsWithinRange(care.date, care.endDate)
      return includesPet && dueToday
    })
    return filtered
  }

  return { caresByPet }
}

export const useCaresByFrequency = (frequency: string) => {
  const cares = useShallowCares()
  
  const caresByFrequency = () => {
    const sorted = cares.reduce((result, care) => {
      const { frequency } = care
      result[frequency] = result[frequency] || []
      result[frequency].push(care)
      return result
    }, {})
    return sorted[frequency] ?? []
  }
  return { caresByFrequency }
}

export const useHealthDueByPet = (petId: string) => {
  const healths = useShallowHealths()

  const healthDueByPet = () => {
    let minDays = Infinity
    healths.filter(health => health.pet._id === petId).forEach(health => {
      if (health.nextDue) {
        const daysToNextDue = countDaysBetween(new Date(), health.nextDue)
        if (daysToNextDue < minDays) minDays = daysToNextDue
      }
    })
    return minDays
  }

  return { healthDueByPet }
}