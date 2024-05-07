import axios from "axios"
import { PET_BASE_URL } from "@services/urls"
import { Id, IdFormData, InitialPet, Pet, PhotoFormData, Service, ServiceFormData } from "./PetInterface"
const BASE_URL = PET_BASE_URL

export const getAllPets = async (): Promise<Pet[]> => {
  return (await axios.get<Pet[]>(BASE_URL)).data
}

export const create = async (formData: InitialPet, photoData: PhotoFormData): Promise<Pet> => {
  const result = (await axios.post<Pet>(BASE_URL, formData)).data
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

export const update = async (formData: InitialPet, photoData: PhotoFormData, petId: string): Promise<Pet> => {
    const result = (await axios.put<Pet>(`${BASE_URL}/${petId}`, formData)).data
    if (photoData) {
      const url = await addPhoto(result._id, photoData)
      result.photo = url
    }
    return result
}

export async function getPetById(petId: string): Promise<Pet> {
  return (await axios.get<Pet>(`${BASE_URL}/${petId}`)).data
}

export async function deletePet(petId: string): Promise<string> {
  return (await axios.delete<string>(`${BASE_URL}/${petId}`)).data
}

export async function addId(formData: IdFormData, petId: string): Promise<Id> {
  return (await axios.patch<Id>(`${BASE_URL}/${petId}/id`, formData)).data
}

export async function deleteId(petId: string, idId: string): Promise<string> {
  return (await axios.delete<string>(`${BASE_URL}/${petId}/id/${idId}`)).data
}

export async function addService(formData: ServiceFormData, petId: string): Promise<Service> {
  return (await axios.patch<Service>(`${BASE_URL}/${petId}/service`, formData)).data
}

export async function deleteService(petId: string, serviceId: string): Promise<string> {
  return (await axios.delete<string>(`${BASE_URL}/${petId}/service/${serviceId}`)).data
}