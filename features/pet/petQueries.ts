import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { IdFormData, Pet, PetFormData, ServiceFormData } from './PetInterface'
import * as petService from './petService'
import { AlertForm } from '@utils/ui'
import { alertError, alertSuccess } from '@utils/misc'

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

export const useAddPet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name,  species, breed, dob, firstMet, altered, status, color, photoData }: PetFormData) => petService.create({ name, species, breed, dob, firstMet, altered, status, color }, photoData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
    }
  })
}

export const useUpdatePet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, species, breed, dob, firstMet, altered, status, color, photoData, petId }: PetFormData) => petService.update({ name,  species, breed, dob, firstMet, altered, status, color }, photoData, petId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
    }
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

export const useAddId = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: IdFormData) => petService.addId(formData, petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
      alertSuccess('Id added', navigation)
    },
    onError: (error) => alertError(error)
  })
}

export const useDeleteId = (petId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ petId, idId }: { petId: string, idId: string }) => petService.deleteId(petId, idId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
      return AlertForm({ body: 'Id deleted successfully', button: 'OK' })
    },
    onError: (error) => alertError(error)
  })
}

export const useAddService = (petId: string, navigation: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: ServiceFormData) => petService.addService(formData, petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
      alertSuccess('Service added', navigation)
    },
    onError: (error) => alertError(error)
  })
}

export const useDeleteService = (petId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ petId, serviceId }: { petId: string, serviceId: string }) => petService.deleteService(petId, serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
      return AlertForm({ body: 'Id deleted successfully', button: 'OK' })
    },
    onError: (error) => alertError(error)
  })
}

