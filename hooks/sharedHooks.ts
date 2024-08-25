import { useQueryClient } from "@tanstack/react-query"
import * as ImagePicker from 'expo-image-picker'
import { Alert } from "react-native"
//queries
import { useDeleteHealth } from "@health/healthQueries"
import { useDeleteCare } from "../features/care/careQueries"
//types
import { Care } from "@care/CareInterface"
import { Health } from "@health/HealthInterface"
import { ProfileData } from "@profile/ProfileInterface"
import { profileKeyFactory } from "@profile/profileQueries"
//helpers
import { countDaysBetween, daysOfWeek, getDateConstructor, getDateInfo } from "@utils/datetime"
import { shouldRenderCareTask } from "../features/home/helpers"

export const showDeleteConfirmation = (onConfirm: (...args: any[]) => void, text2: string = 'This action cannot be undone.', text1: string = 'Are you sure?') => Alert.alert(
  text1,
  text2,
  [
    { text: 'Yes', onPress: onConfirm},
    { text: 'No', style: 'cancel' },
  ],
  { cancelable: true },
)

export const useDeleteCareCard = (navigation: any) => {
  const deleteCareMutation = useDeleteCare(navigation)

  const deleteCareCard = (careId: string) => deleteCareMutation.mutate(careId)

  const handleDeleteCare = (care: Care) => showDeleteConfirmation(
    () => deleteCareCard(care._id), 
    `Remove ${care.name} tracker?`
  )

  return handleDeleteCare
}

export const useDeleteHealthCard = (navigation: any) => {
  const deleteHealthMutation = useDeleteHealth(navigation)

  const deleteHealthCard = (healthId: string) => deleteHealthMutation.mutate(healthId)
  const handleDeleteHealth = (health: Health) => showDeleteConfirmation(
    () => deleteHealthCard(health._id), 
    `Remove ${health.name} calendar?`
  )

  return handleDeleteHealth
}

export const useShallowPets = () => {
  const queryClient = useQueryClient()

  const pets = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile)?.pets

  const PET_BASICS = pets?.map(pet => ({ _id: pet._id, name: pet.name, photo: pet.photo, species: pet.species, color: pet.color, gender: pet.gender }))
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

  const petServices = (petId: string) => {
    return pets.find(pet => pet._id === petId).services ?? []
  }

  return { petIdToColor, petIdToPet, PET_NAMES, PET_IDS, PET_BASICS, petServices }
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

export const useCaresByFrequency = (frequency: string): Care[] => {
  const queryClient = useQueryClient()
  const cares = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).cares
  
  const caresByFrequency = () => {
    return cares[frequency] ?? []
  }

  return caresByFrequency()
}

export const useAllCares = (): Care[] => {
  const queryClient = useQueryClient()
  const cares = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).cares
  
  const allCares = () => {
    return Object.values(cares).flat()
  }

  return allCares()
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
