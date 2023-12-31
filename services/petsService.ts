import * as tokenService from './tokenService'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export interface Pet {
  _id: string
  name: string
  age: number
  species: string
  breed: string
  photo: string
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

export async function addPhoto(petId: string, photoData: any): Promise<any> {
  try {
    const token = await tokenService.getToken()
    const photoFormData = new FormData()
    photoFormData.append('file', photoData)

    console.log('photoFormData sent', photoFormData)

    const res = await fetch(`${BASE_URL}/${petId}/add-photo`, {
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

export async function edit(petId: string, { name, age, species, breed }): Promise<Pet> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${petId}`, {
      method: 'PUT',
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

export async function show(petId: string): Promise<Pet> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${petId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}