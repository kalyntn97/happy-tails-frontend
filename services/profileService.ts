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