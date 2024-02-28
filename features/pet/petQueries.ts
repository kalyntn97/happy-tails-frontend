import axios, { AxiosError } from 'axios'
import { useQuery, UseQueryOptions, useQueryClient, useMutation } from '@tanstack/react-query'
import { Pet } from './PetInterface'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export const petKeyFactory = {
  pets: ['all-pets'],
  petById: (id: string) => [...petKeyFactory.pets, id],
  addPet: ['add-pet']
}

export const getAllPets = async () => {
  return (await axios.get<Pet[]>(BASE_URL)).data
}

export const getPetById = async (petId: string) => {
  return (await axios.get<Pet>(`${BASE_URL}/${petId}`)).data
}

export const addPet = async (petFormData: PetFormData) => {
  return (await axios.post<Pet>(BASE_URL, petFormData)).data
}

export const useGetAllPets = (
  options?: UseQueryOptions<Pet[], AxiosError, Pet[], readonly [string]>
) => {
  return useQuery({
    queryKey: [...petKeyFactory.pets],
    queryFn: getAllPets, 
    ...options
  })
} 

export const useGetPetById = (
  petId: string,
  options?: UseQueryOptions<Pet, AxiosError, Pet, readonly (string)[]>
) => {
  return useQuery({
    queryKey: [...petKeyFactory.petById(petId)],
    queryFn: () => getPetById(petId), 
    ...options
  })
} 


export const useAddPet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationKey: [...petKeyFactory.addPet],
    mutationFn: addPet,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...petKeyFactory.pets] })
    }
  })
}


