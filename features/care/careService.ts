import axios from 'axios'
import * as authHelpers from '../auth/authHelpers'
import { CARE_BASE_URL } from '../../services/urls'
import { Pet } from "@pet/PetInterface"
import { Care } from './CareInterface'

const BASE_URL = CARE_BASE_URL

//types

export async function getAllCares(): Promise<Care[]> {
  return (await axios.get<Care[]>(BASE_URL)).data
}

export async function index(): Promise<Care[]> {
  try {
    const token = await authHelpers.getToken()
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
    const token = await authHelpers.getToken()
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
    const token = await authHelpers.getToken()
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
    const token = await authHelpers.getToken()
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
    const token = await authHelpers.getToken()
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
    const token = await authHelpers.getToken()
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
    const token = await authHelpers.getToken()
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

export async function checkAllDone(careId: string, trackerId: string, index: number) {
  try {
    const token = await authHelpers.getToken()
    const res = await fetch(`${BASE_URL}/${careId}/${trackerId}/check-all`, {
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

export async function uncheckAllDone(careId: string, trackerId: string, index: number) {
  try {
    const token = await authHelpers.getToken()
    const res = await fetch(`${BASE_URL}/${careId}/${trackerId}/uncheck-all`, {
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
    const token = await authHelpers.getToken()
    const res = await fetch(`${BASE_URL}/${careId}/auto`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function HomeFeed() {
  try {
    const token = await authHelpers.getToken()
    const res = await fetch(`${BASE_URL}/feed`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}