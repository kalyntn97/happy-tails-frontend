import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Id, IdFormData, Pet, PetFormData, PetMutationFormData, PhotoFormData } from './PetInterface'
import * as petService from './petService'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

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
    mutationFn: ({ name,  species, breed, dob, firstMet, altered, status, color, photoData }: PetMutationFormData) => petService.create({ name, species, breed, dob, firstMet, altered, status, color }, photoData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
    }
  })
}

export const useUpdatePet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, species, breed, dob, firstMet, altered, status, color, photoData, petId }: PetMutationFormData) => petService.update({ name,  species, breed, dob, firstMet, altered, status, color }, photoData, petId),
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

export const useAddId = (petId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: Id) => petService.addId(formData, petId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
    }
  })
}

export const useDeleteId = (petId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ petId, idId }: { petId: string, idId: string }) => petService.deleteId(petId, idId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(petId)] })
    }
  })
}

