import axios from "axios"
const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export interface Pet {
  _id: string
  name: string
  age: number
  species: string 
  breed: string
  photo: string | null
}

export async function index(): Promise<Pet[]> {
  try {
    const result = await axios.get(BASE_URL)
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function create(name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null): Promise<Pet> {
  try {
    const result = await axios.post(BASE_URL, { name, age, species, breed, photoData })
    if (photoData) {
      const url = await addPhoto(result.data._id, photoData)
      result.data.photo = url
    }
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function addPhoto(petId: string, photoData: any): Promise<any> {
  try {
    const photoFormData = new FormData()
    photoFormData.append('file', photoData)

    const result = await axios.patch(`${BASE_URL}/${petId}/add-photo`, photoFormData)
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function update(name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string): Promise<Pet> {
  try {
    const result = await axios.put(`${BASE_URL}/${petId}`, { name, age, species, breed })
    if (photoData) {
      const url = await addPhoto(result.data._id, photoData)
      result.data.photo = url
    }
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function show(petId: string): Promise<Pet> {
  try {
    const result = await axios.get(`${BASE_URL}/${petId}`)
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function deletePet(petId: string): Promise<Pet> {
  try {
    const result = await axios.delete(`${BASE_URL}/${petId}`)
    return result.data
  } catch (error) {
    console.error(error)
  }
}

