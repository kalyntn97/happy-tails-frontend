import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Id, IdFormData, Illness, IllnessFormData, Medication, Pet, PetFormData, PetMutationFormData, PhotoFormData, Service, ServiceFormData } from './PetInterface'
import * as petService from './petService'
import { AlertForm } from '@utils/ui'
import { alertError, alertSuccess, showSuccessToast } from '@utils/misc'
import { usePetActions, usePets } from '@store/store'
import { profileKeyFactory } from '@profile/profileQueries'
import { ProfileData } from '@profile/ProfileInterface'


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
    initialData: queryClient.getQueryData(profileKeyFactory.profile).profile.pets.find((pet: Pet) => pet._id === petId),
    enabled: isEnabled,
  })
} 

export const useAddPet = (navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData, photoData } : PetMutationFormData) => petService.create(formData, photoData),
    onSuccess: (data: Pet) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, profile: { ...oldData.profile, pets: [...oldData.profile.pets, data]}}
      })
      alertSuccess('Pet added')
      return navigation.navigate('Index')
    },
    onError: (error) => alertError(error)
  })
}

export const useUpdatePet = (navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData, photoData } : PetMutationFormData) => petService.update(formData, photoData),
    onSuccess: (data: Pet) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, profile: { ...oldData.profile, pets: oldData.profile.pets.map(pet => pet._id === data._id ? data : pet) }}
      })
      alertSuccess('Pet updated')
      return navigation.navigate('Details', data._id)
    },
    onError: (error) => alertError(error)
  })
}

export const useDeletePet = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (petId: string) => petService.deletePet(petId),
    onSuccess: (data: string) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return {...oldData, profile: { ...oldData.profile, pets: oldData.profile.pets.filter(pet => pet._id !== data) }}
      })
      alertSuccess('Pet deleted!')
      return navigation.navigate('Index')
    }, 
    onError: (error) => alertError(error)
  })
}

export const useAddPetDetail = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()

  const addPetDetail = (key: string, formData: any) => {
    const keyToService = {
      id: () => petService.addId(formData, petId),
      service: () => petService.addService(formData, petId),
      illness: () => petService.addIllness(formData, petId),
      med: () => petService.addMedication(formData, petId),
    }
    return keyToService[key]()
  }

  return useMutation({
    mutationFn: ({ key, formData }: { key: string, formData: any }) => addPetDetail(key, formData),
    onSuccess: (data: { item: Id | Service | Illness | Medication, key: string }) => {
      queryClient.setQueryData(petKeyFactory.petById(petId), (oldData: Pet) => oldData[data.key].push(data.item))
      navigation.navigate('MoreDetails', petId)
      return showSuccessToast('Item added!')
    }, 
    onError: (error) => alertError(error)
  })
}

export const useDeletePetDetail = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()
  
  const deletePetDetail = (key: string, detailId: string) => {
    const keyToService = {
      id: () => petService.deleteId(petId, detailId),
      service: () => petService.deleteService(petId, detailId),
      illness: () => petService.deleteIllness(petId, detailId),
      med: () => petService.deleteMedication(petId, detailId),
    }
    return keyToService[key]()
  }

  return useMutation({
    mutationFn: ({ key, detailId }: { key: string, detailId: string }) => deletePetDetail(key, detailId),
    onSuccess: (data: { itemId: string, key: string }) => {
      queryClient.setQueryData(petKeyFactory.petById(petId), (oldData: Pet) => oldData[data.key].filter((item: Id | Service | Illness | Medication) => item._id !== data.itemId))
      navigation.navigate('MoreDetails', petId)
      return showSuccessToast('Item added!')
    },
    onError: (error) => alertError(error)
  })
}