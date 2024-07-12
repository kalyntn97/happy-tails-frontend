import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Detail, DetailType, Id, IdFormData, Illness, IllnessFormData, Medication, Pet, PetFormData, PetMutationFormData, PhotoFormData, Service, ServiceFormData } from './PetInterface'
//utils
import { profileKeyFactory } from '@profile/profileQueries'
import { ProfileData } from '@profile/ProfileInterface'
import { alertError, showToast } from '@utils/misc'
import * as petService from './petService'

export const petKeyFactory = {
  pets: ['all-pets'],
  petById: (id: string) => [...petKeyFactory.pets, id],
}

// export const useGetAllPets = () => {
//   const pets = usePets()

//   return useQuery({
//     initialData: pets,
//     queryKey: [...petKeyFactory.pets],
//     queryFn: petService.getAllPets, 
//   })
// } 

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
      navigation.navigate('Index')
      showToast({ text1: 'Pet added.', style: 'success' })
    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
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
      navigation.navigate('Details', { petId: data._id })
      showToast({ text1: 'Pet updated.', style: 'success' })
    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeletePet = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (petId: string) => petService.deletePet(petId),
    onSuccess: (data: string) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, pets: oldData.pets.filter(pet => pet._id !== data) }
      })
      navigation.navigate('Index')
      showToast({ text1: 'Pet removed.', style: 'success' })
    }, 
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useAddPetDetail = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()

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
    onSuccess: (data: { item: Detail, type: DetailType }) => {
      queryClient.setQueryData(petKeyFactory.petById(petId), (oldData: Pet) => {
        return { ...oldData, [data.type]: [...oldData[data.type], data.item] }
      })
      navigation.navigate('MoreDetails', { petId, show: data.type })
      showToast({ text1: 'Detail added.', style: 'success' })
    }, 
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeletePetDetail = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()
  
  const deletePetDetail = (type: string, detailId: string) => {
    const typeToService = {
      ids: () => petService.deleteId(petId, detailId),
      services: () => petService.deleteService(petId, detailId),
      illnesses: () => petService.deleteIllness(petId, detailId),
      meds: () => petService.deleteMedication(petId, detailId),
    }
    return typeToService[type]()
  }

  return useMutation({
    mutationFn: ({ type, detailId }: { type: DetailType, detailId: string }) => deletePetDetail(type, detailId),
    onSuccess: (data: { itemId: string, type: DetailType }) => {
      queryClient.setQueryData(petKeyFactory.petById(petId), (oldData: Pet) => {
        return { ...oldData, [data.type]: oldData[data.type].filter((item: Detail) => item._id !== data.itemId) }
      })
      navigation.navigate('MoreDetails', { petId, show: data.type })
      showToast({ text1: 'Detail deleted.', style: 'success' })
    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}