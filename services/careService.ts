import * as tokenService from './tokenService'
import { Pet } from "./petService"

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/care-cards`

//types
export interface Tracker {
  _id: string
  name: string
  total: number
  done: number[]
  skipped: number
  left: number
}

export interface Care {
  _id: string
  pets: Pet[]
  name: string
  times: number
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
  trackers: Tracker[]
}

export async function index(): Promise<Care[]> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
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
    console.error(error)
  }
}

export async function update(name: string, frequency: string, times: number, pets: string[], careId: string) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${careId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, frequency, times, pets })
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function show(careId: string) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${careId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function deleteCareCard(careId: string) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${careId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function checkDone(careId: string, trackerId: string, index: number) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${careId}/${trackerId}/check`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index })
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function uncheckDone(careId: string, trackerId: string, index: number) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${careId}/${trackerId}/uncheck`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index })
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function autoCreateTracker(careId: string) {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${careId}/auto`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function careFeed() {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/feed`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}