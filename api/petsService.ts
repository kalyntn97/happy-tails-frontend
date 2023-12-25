import * as tokenService from '../api/tokenService'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export interface Pet {
  _id: string
  name: string
  age: number
  species: string
  breed: string
}

export async function index(): Promise<Pet[]> {
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

export async function create({ name, age, species, breed }): Promise<Pet> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, age, species, breed })
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}
