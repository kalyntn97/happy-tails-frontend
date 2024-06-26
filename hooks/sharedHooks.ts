//npm
import { FC, useState } from "react"
import { Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { useQueryClient } from "@tanstack/react-query"
//queries
import { useDeleteCare } from "../features/care/careQueries"
import { useDeleteHealth } from "@health/healthQueries"
//types
import { Care } from "@care/CareInterface"
import { profileKeyFactory } from "@profile/profileQueries"
import { ProfileData } from "@profile/ProfileInterface"
//helpers
import { AlertForm } from "@utils/ui"
import { countDaysBetween } from "@utils/datetime"
import { shouldRenderCareTask } from "../features/home/helpers"

export const showDeleteConfirmDialog = (item: any, handleDeleteItem: (itemId: string) => void) => {
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
  const deleteCareMutation = useDeleteCare(navigation)

  const handleDeleteCareCard = async (careId: string) => {
    deleteCareMutation.mutate(careId)
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

export const useShallowPets = () => {
  const queryClient = useQueryClient()

  const pets = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).pets

  const PET_BASICS = pets.map(pet => ({ _id: pet._id, name: pet.name, photo: pet.photo, species: pet.species, color: pet.color }))
  const PET_NAMES = PET_BASICS.map(pet => pet.name)
  const PET_IDS = PET_BASICS.map(pet => pet._id)

  const petIdToColor = (petId: string) => {
    if (pets.length) {
      return PET_BASICS.find(pet => pet._id === petId).color
    }
  }

  const petIdToPet = (petId: string) => {
    return PET_BASICS.find(pet => pet._id === petId)
  }

  return { petIdToColor, petIdToPet, PET_NAMES, PET_IDS, PET_BASICS }
}


export const useSelectPhoto = async () => {
  let _image = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  })
  if (!_image.canceled) {
    return _image.assets[0].uri
  }
}

export const useCaresByPet = (petId: string): Care[] => {
  const queryClient = useQueryClient()
  const cares = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).cares
  
  const caresByPet = () => {
    const filtered = Object.values(cares).flat().filter(care => {
      const includesPet = care.pets.map(p => p._id).includes(petId)
      const dueToday = shouldRenderCareTask(care, new Date()) && care.frequency === 'Daily'
      return includesPet && dueToday
    })
    return filtered
  }
  return caresByPet()
}

export const useCaresByFrequency = (frequency: string) => {
  const queryClient = useQueryClient()
  const cares = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).cares
  
  const caresByFrequency = () => {
    return cares[frequency] ?? []
  }

  return caresByFrequency
}

export const useHealthDueByPet = (petId: string): { minDays: number, healthId: string } => {
  const queryClient = useQueryClient()
  const healths = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).healths

  const healthDueByPet = () => {
    let minDays = Infinity
    let healthId = null
    healths.filter(health => health.pet._id === petId).forEach(health => {
      if (health.nextDue) {
        const daysToNextDue = countDaysBetween('today', health.nextDue.date)
        if (daysToNextDue < minDays) {
          minDays = daysToNextDue
          healthId = health._id
        }
      }
    }) 
    if (minDays && healthId) return { minDays, healthId }
    else return null
  }
  return healthDueByPet()
}

export const useTaskCounts = () => {
  const queryClient = useQueryClient()
  
  //* num of tasks due today
  const careCounts = (selectedDate: Date) => {
    const cares = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).cares
    const filtered = Object.values(cares).flat().filter((care: Care) => shouldRenderCareTask(care, selectedDate) && care.frequency === 'Daily')
    return filtered.length
  }
  //* num of days until the next vet visit
  const healthCounts = () => {
    let minDays = Infinity
    const petIds = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).profile.pets.map(pet => pet._id)
    petIds.forEach(petId => {
      const healthDueByPet = useHealthDueByPet(petId)
      const days = healthDueByPet()
      if (days < minDays) minDays = days
      return minDays
    })
    return minDays
  }
  return { careCounts, healthCounts }
}
