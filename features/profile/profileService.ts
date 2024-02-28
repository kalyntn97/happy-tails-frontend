import axios from 'axios'
import { PROFILE_BASE_URL } from '@services/urls'
import { Pet } from '@pet/PetInterface'
import { Care } from '@care/CareInterface'

const BASE_URL = PROFILE_BASE_URL

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
    const photoFormData = new FormData()
    photoFormData.append('file', photoData)

    const result = await axios.patch(`${BASE_URL}/add-photo`, photoFormData)
    return result.data
  } catch (error) {
    console.error(error)
  }
}

export async function update(name: string, bio: string, photoData: { uri: string, name: string, type: string } | null): Promise<Profile> {
  try {
    const result = await axios.put(`${BASE_URL}/update`, { name, bio })

    if (photoData) {
      const url = await addPhoto(photoData)
      result.data.photo = url
    }
    return result.data
  } catch (error) {
    console.error(error)
  }
}