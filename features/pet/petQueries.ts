import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { IdFormData, IllnessFormData, Pet, PetFormData, PetMutationFormData, PhotoFormData, ServiceFormData } from './PetInterface'
import * as petService from './petService'
import { AlertForm } from '@utils/ui'
import { alertError, alertSuccess } from '@utils/misc'
import { usePetActions } from '@store/store'

export const petKeyFactory = {
  pets: ['all-pets'],
  petById: (id: string) => [...petKeyFactory.pets, id],
}

export const useGetAllPets = () => {
  return useQuery({
    queryKey: [...petKeyFactory.pets],
    queryFn: petService.getAllPets, 
  })
} 

export const useGetPetById = (petId: string, initialPet: Pet) => {
  return useQuery({
    queryKey: [...petKeyFactory.petById(petId)],
    queryFn: () => petService.getPetById(petId),
    initialData: initialPet,
  })
} 

export const useAddPet = (navigation: any) => {
  const queryClient = useQueryClient()
  const { onAddPet } = usePetActions()

  return useMutation({
    mutationFn: ({ formData, photoData } : PetMutationFormData) => petService.create(formData, photoData),
    onSuccess: (data) => {
      onAddPet(data)
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
      navigation.navigate('Index')
      return alertSuccess('Pet added', navigation)
    },
    onError: (error) => alertError(error)
  })
}

export const useUpdatePet = (navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formData, photoData } : PetMutationFormData) => petService.update(formData, photoData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
      navigation.navigate('Details', { screen: 'Index', params : { pet: data } })
      return alertSuccess('Pet updated', navigation)
    },
    onError: (error) => alertError(error)
  })
}

export const useDeletePet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (petId: string) => petService.deletePet(petId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
    }
  })
}

export const useAddPetDetail = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()

  const addPetDetail = (key: string, formData: any) => {
    const keyToService = {
      id: () => petService.addId(formData, petId),
      service: () => petService.addService(formData, petId),
      illness: () => petService.addIllness(formData, petId),
    }
    return keyToService[key]()
  }

  return useMutation({
    mutationFn: ({ key, formData }: { key: string, formData: any }) => addPetDetail(key, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
      return alertSuccess('Detail added', navigation)
    },
    onError: (error) => alertError(error)
  })
}

export const useDeletePetDetail = (petId: string) => {
  const queryClient = useQueryClient()
  
  const deletePetDetail = (key: string, detailId: string) => {
    const keyToService = {
      id: () => petService.deleteId(petId, detailId),
      service: () => petService.deleteService(petId, detailId),
      illness: () => petService.deleteIllness(petId, detailId),
    }
    return keyToService[key]()
  }

  return useMutation({
    mutationFn: ({ key, detailId }: { key: string, detailId: string }) => deletePetDetail(key, detailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
      return AlertForm({ body: `Detail deleted successfully`, button: 'OK' })
    },
    onError: (error) => alertError(error)
  })
}