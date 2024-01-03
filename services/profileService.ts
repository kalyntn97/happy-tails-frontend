import * as tokenService from './tokenService'
import { Pet } from './petService'
import JWT from 'expo-jwt'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/profile`

export interface Profile {
  _id: string
  name: string
  photo: string | null
  bio: string
  pets: Pet[]
}

export async function show(): Promise<Profile> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

export async function addPhoto(photoData: any, token: string): Promise<any> {
  try {
    const photoFormData = new FormData()
    photoFormData.append('file', photoData)

    console.log('photoFormData sent', photoFormData)

    const res = await fetch(`${BASE_URL}/add-photo`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: photoFormData,
    })
    return await res.json()
  } catch (error) {
    console.log(error)
  }
}

export async function update(name: string, bio: string, photoData: { uri: string, name: string, type: string } | null): Promise<Profile> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/update`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, bio })
    })
    if (photoData) {
      const jsonRes = await res.json()
      console.log('jsonRes', jsonRes)
      const urlRes = await addPhoto(photoData, token)
      jsonRes.photo = urlRes.url
      return jsonRes
    } else {
      return await res.json()
    }
  } catch (error) {
    console.log(error)
  }
}