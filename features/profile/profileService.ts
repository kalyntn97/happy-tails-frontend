import axios from 'axios'
import { PROFILE_BASE_URL } from '@services/urls'
import { Profile, ProfileData, ProfileFormData } from './ProfileInterface'

const BASE_URL = PROFILE_BASE_URL

export async function getProfile(year: number) {
  return (await axios.get<ProfileData>(`${BASE_URL}/${year}`)).data
}

export async function addPhoto(photoData: any): Promise<string> {
  const photoFormData = new FormData()
  photoFormData.append('file', photoData)

  return (await axios.patch<string>(`${BASE_URL}/add-photo`, photoFormData)).data
}

export async function addBanner(photoData: any): Promise<string> {
  const photoFormData = new FormData()
  photoFormData.append('file', photoData)

  return (await axios.patch<string>(`${BASE_URL}/add-banner`, photoFormData)).data
}

export async function update(formData: ProfileFormData, photoData: { uri: string, name: string, type: string } | null): Promise<Profile> {
  const result = (await axios.put<Profile>(`${BASE_URL}/update`,formData)).data
  if (photoData) {
    const url = await addPhoto(photoData)
    result.photo = url
  }
  return result
}

// export async function updateStreak(): Promise<Streak> {
//   return (await axios.patch<Streak>(`${BASE_URL}/streak`)).data
// }
