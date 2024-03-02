import axios from 'axios'
import { PROFILE_BASE_URL } from '@services/urls'
import { Profile } from './ProfileInterface'


const BASE_URL = PROFILE_BASE_URL

export async function getProfile() {
  return (await axios.get<Profile>(BASE_URL)).data
}

export async function addPhoto(photoData: any): Promise<string> {
  const photoFormData = new FormData()
  photoFormData.append('file', photoData)

  return (await axios.patch<string>(`${BASE_URL}/add-photo`, photoFormData)).data
}

export async function update(name: string, bio: string, photoData: { uri: string, name: string, type: string } | null): Promise<Profile> {
  const result = (await axios.put<Profile>(`${BASE_URL}/update`, { name, bio })).data

  if (photoData) {
    const url = await addPhoto(photoData)
    result.photo = url
  }
  return result
}