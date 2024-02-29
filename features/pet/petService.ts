import axios from "axios"
import { PET_BASE_URL } from "@services/urls"
const BASE_URL = PET_BASE_URL

export interface Pet {
  _id: string
  name: string
  age: number
  species: string 
  breed: string
  photo: string | null
}

export const getAllPets = async () => {
  return (await axios.get<Pet[]>(BASE_URL)).data
}

// export async function create(name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null): Promise<any> {
//   try {
//     const result = await axios.post(BASE_URL, { name, age, species, breed, photoData })
//     if (photoData) {
//       const url = await addPhoto(result.data._id, photoData)
//       result.data.photo = url
//     }
//     return result.data
//   } catch (error) {
//     console.error(error)
//     return { error }
//   }
// }

export const create = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null): Promise<Pet> => {
  const result = (await axios.post<Pet>(BASE_URL, { name, age, species, breed })).data
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

export const update = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string): Promise<Pet> => {
    const result = (await axios.put<Pet>(`${BASE_URL}/${petId}`, { name, age, species, breed })).data
    if (photoData) {
      const url = await addPhoto(result._id, photoData)
      result.photo = url
    }
    return result
}

export async function show(petId: string): Promise<any> {
  return (await axios.get<Pet>(`${BASE_URL}/${petId}`)).data
}

export async function deletePet(petId: string): Promise<string> {
  return (await axios.delete<string>(`${BASE_URL}/${petId}`)).data
}
