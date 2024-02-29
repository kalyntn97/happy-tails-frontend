import axios, { AxiosError } from 'axios'
import { useQuery, UseQueryOptions, useQueryClient, useMutation } from '@tanstack/react-query'
import { Pet, PetFormData } from './PetInterface'
import * as petService from './petService'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export const petKeyFactory = {
  pets: ['all-pets'],
  petById: (id: string) => [...petKeyFactory.pets, id],
  addPet: ['add-pet']
}

export const useGetAllPets = () => {
  return useQuery({
    queryKey: [...petKeyFactory.pets],
    queryFn: petService.getAllPets, 
  })
} 

// export const useGetPetById = (
//   petId: string,
//   options?: UseQueryOptions<Pet, AxiosError, Pet, readonly (string)[]>
// ) => {
//   return useQuery({
//     queryKey: [...petKeyFactory.petById(petId)],
//     queryFn: () => getPetById(petId), 
//     ...options
//   })
// } 

export const useAddPet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationKey: [...petKeyFactory.addPet],
    mutationFn: ({ name, age, species, breed, photoData }: PetFormData) => petService.create(name, age, species, breed, photoData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
    }
  })
}


