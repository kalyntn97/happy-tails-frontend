import * as tokenService from './tokenService'
import { Pet } from "./petService"

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/care-cards`

//types
export interface Tracker {
  _id: string
  name: string
  total: number
  done: number
  skipped: number
  left: number
}

export interface Care {
  _id: string
  pets: Pet[]
  name: string
  times: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  trackers: Array<string>
}

export async function index(): Promise<Care[]> {
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

export async function create(name: string, frequency: string, times: number, pets: string[]) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, frequency, times, pets })
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}