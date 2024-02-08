import * as tokenService from './tokenService'

const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export interface Pet {
  _id: string
  name: string
  age: number
  species: string 
  breed: string
  photo: string | null
}

export async function index(): Promise<Pet[]> {
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

export async function create(name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null): Promise<Pet> {
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
    if (photoData) {
      const jsonRes = await res.json()
      const urlRes = await addPhoto(jsonRes._id, photoData)
      jsonRes.photo = urlRes.url
      return jsonRes
    } else {
      return res.json()
    }
  } catch (error) {
    console.error(error)
  }
}

export async function addPhoto(petId: string, photoData: any): Promise<any> {
  try {
    const token = await tokenService.getToken()
    const photoFormData = new FormData()
    photoFormData.append('file', photoData)

    const res = await fetch(`${BASE_URL}/${petId}/add-photo`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: photoFormData,
    })

    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function edit(name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string): Promise<Pet> {
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
    if (photoData) {
      const jsonRes = await res.json()
      const urlRes = await addPhoto(jsonRes._id, photoData)
      jsonRes.photo = urlRes.url
      return jsonRes
    } else {
      return res.json()
    }
  } catch (error) {
    console.error(error)
  }
}

export async function show(petId: string): Promise<Pet> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

export async function deletePet(petId: string): Promise<Pet> {
  try {
    const token = await tokenService.getToken()
    const res = await fetch(`${BASE_URL}/${petId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

