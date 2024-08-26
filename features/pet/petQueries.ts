import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Detail, DetailType, Pet, PetMutationFormData } from './PetInterface'
//utils
import { Profile, ProfileData } from '@profile/ProfileInterface'
import { profileKeyFactory } from '@profile/profileQueries'
import { showToast } from '@utils/misc'
import * as petService from './petService'
import { showDeleteConfirmation } from '@hooks/sharedHooks'
import { produce } from 'immer'
import { useNavigation } from '@react-navigation/native'

export const petKeyFactory = {
  pets: ['all-pets'],
  petById: (id: string) => [...petKeyFactory.pets, id],
}

export const useGetPetById = (petId: string, isEnabled: boolean) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: [...petKeyFactory.petById(petId)],
    queryFn: () => petService.getPetById(petId),
    initialData: () => queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).pets.find((pet: Pet) => pet._id === petId),
    enabled: isEnabled,
  })
} 

export const useAddPet = (navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData, photoData } : PetMutationFormData) => petService.create(formData, photoData),
    onSuccess: (data: Pet) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, pets: [...oldData.pets, data]}
      })
      showToast({ text1: 'Pet added.', style: 'success' })
      navigation.navigate('Home', { screen: 'Pets' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUpdatePet = (navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData, photoData } : PetMutationFormData) => petService.update(formData, photoData),
    onSuccess: (data: Pet) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, pets: oldData.pets.map(pet => pet._id === data._id ? data : pet) }
      })
      queryClient.prefetchQuery({ queryKey: petKeyFactory.petById(data._id) })
      showToast({ text1: 'Pet updated.', style: 'success' })
      navigation.navigate('PetDetails', { petId: data._id })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeletePet = (navigation: any) => {
  const queryClient = useQueryClient()
  
  const deletePetMutation = useMutation({
    mutationFn: (petId: string) => petService.deletePet(petId),
    onSuccess: (data: string) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, pets: oldData.pets.filter(pet => pet._id !== data) }
      })
      navigation.navigate('Home', { screen: 'Pets' })
      showToast({ text1: 'Pet removed.', style: 'success' })
    }, 
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })

  const deletePet = (petId: string) => deletePetMutation.mutate(petId)
  const isPending = deletePetMutation.isPending

  const handleDeletePet = (pet: Pet) => showDeleteConfirmation(
    () => deletePet(pet._id),
    undefined,
    `Remove ${pet.name}?`
  )
  return { handleDeletePet, isPending }
}

export const useAddPetDetail = (petId: string) => {
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  const addPetDetail = (type: string, formData: any) => {
    const typeToService = {
      ids: () => petService.addId(formData, petId),
      services: () => petService.addService(formData, petId),
      illnesses: () => petService.addIllness(formData, petId),
      meds: () => petService.addMedication(formData, petId),
    }
    return typeToService[type]()
  }

  return useMutation({
    mutationFn: ({ type, formData }: { type: DetailType, formData: any }) => addPetDetail(type, formData),
    onSuccess: (data: { item: Detail, type: DetailType, pets?: string[] }) => {
      if (data.pets) {
        data.pets.map(pet => {
          queryClient.setQueryData(petKeyFactory.petById(pet), (oldData: Pet) => 
            produce(oldData, draft => {
              if (draft[data.type]) draft[data.type] = draft[data.type].push(data.item)
            })
            // return { ...oldData, [data.type]: [...oldData[data.type], data.item] }
          )
        })
      } else queryClient.setQueryData(petKeyFactory.petById(petId), (oldData: Pet) =>
        produce(oldData, draft => {
          if (draft[data.type]) draft[data.type] = draft[data.type].push(data.item)
        })
        // return { ...oldData, [data.type]: [...oldData[data.type], data.item] }
      )
      navigation.navigate('MoreDetails', { petId, show: data.type })
      showToast({ text1: 'Detail added.', style: 'success' })
    }, 
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeletePetDetail = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()
  
  const deletePetDetailByType = (type: string, detailId: string) => {
    const typeToService = {
      ids: () => petService.deleteId(petId, detailId),
      services: () => petService.deleteService(petId, detailId),
      illnesses: () => petService.deleteIllness(petId, detailId),
      meds: () => petService.deleteMedication(petId, detailId),
    }
    return typeToService[type]()
  }

  const deletePetDetailMutation = useMutation({
    mutationFn: ({ type, detailId }: { type: DetailType, detailId: string }) => deletePetDetailByType(type, detailId),
    onSuccess: (data: { itemId: string, type: DetailType }) => {
      queryClient.setQueryData(petKeyFactory.petById(petId), (oldData: Pet) => {
        return { ...oldData, [data.type]: oldData[data.type].filter((item: Detail) => item._id !== data.itemId) }
      })
      navigation.navigate('MoreDetails', { petId, show: data.type })
      showToast({ text1: 'Detail deleted.', style: 'success' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })

  const isPending = deletePetDetailMutation.isPending
  const deletePetDetail = (type: DetailType, detailId: string) => deletePetDetailMutation.mutate({ type, detailId })

  const handleDeletePetDetail = (type: DetailType, detail: Detail) => showDeleteConfirmation(
    () => deletePetDetail(type, detail._id),
    undefined,
    `Remove ${detail.name} ?`
  )

  return { handleDeletePetDetail, isPending }
}