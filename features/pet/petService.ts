import axios from "axios"
import { PET_BASE_URL } from "@services/urls"
import { Pet } from "./PetInterface"
const BASE_URL = PET_BASE_URL

export const getAllPets = async () => {
  return (await axios.get<Pet[]>(BASE_URL)).data
}

export const create = async (name: string, species: string, breed: string, dob: Date, firstMet: Date, altered: {value: boolean, date: Date | null}, status: {value: string, date: Date | null, show: boolean }, color: number, photoData: { uri: string, name: string, type: string } | null): Promise<Pet> => {
  const result = (await axios.post<Pet>(BASE_URL, { name, species, breed, dob, firstMet, altered, status, color })).data
  if (photoData) {
    const url = await addPhoto(result._id, photoData)
    result.photo = url
  }
  return result
}

export const addPhoto = async (petId: string, photoData: any): Promise<string> => {
  const photoFormData = new FormData()
  photoFormData.append('file', photoData)
  return (await axios.patch<string>(`${BASE_URL}/${petId}/add-photo`, photoFormData)).data
}

export const update = async (name: string,  species: string, breed: string, dob: Date, firstMet: Date, altered: {value: boolean, date: Date | null}, status: {value: string, date: Date | null, show: boolean }, color: number, photoData: { uri: string, name: string, type: string } | null, petId: string): Promise<Pet> => {
    const result = (await axios.put<Pet>(`${BASE_URL}/${petId}`, { name, species, breed, dob, firstMet, altered, status, color })).data
    if (photoData) {
      const url = await addPhoto(result._id, photoData)
      result.photo = url
    }
    return result
}

export async function getPetById(petId: string): Promise<any> {
  return (await axios.get<Pet>(`${BASE_URL}/${petId}`)).data
}

export async function deletePet(petId: string): Promise<string> {
  return (await axios.delete<string>(`${BASE_URL}/${petId}`)).data
}
