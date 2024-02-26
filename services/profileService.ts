import axios from 'axios'
import * as tokenService from './tokenService'
import { Pet } from './petService'
import { Care } from './careService'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/profile`

export interface Profile {
  _id: string
  name: string
  photo: string | null
  bio: string
  pets: Pet[]
  careCards: Care[]
}

export async function show(): Promise<Profile> {
  try {
    const result = await axios.get(BASE_URL)
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function addPhoto(photoData: any): Promise<any> {
  try {
    // const token = await tokenService.getToken()
    const photoFormData = new FormData()
    photoFormData.append('file', photoData)

    const result = await axios.patch(`${BASE_URL}/add-photo`, photoFormData)
    return result.data.url
  } catch (error) {
    console.error(error)
  }
}

export async function update(name: string, bio: string, photoData: { uri: string, name: string, type: string } | null): Promise<Profile> {
  try {
    const result = await axios.put(`${BASE_URL}/update`, { name, bio, photoData })

    if (photoData) {
      const url = await addPhoto(photoData)
      result.data.photo = url
    }
    return result.data
  } catch (error) {
    console.error(error)
  }
}