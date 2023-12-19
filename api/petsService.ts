const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export interface Pet {
  _id: string
  name: string
  age: number
  species: string
  breed: string
}

export async function index(authToken: string | undefined): Promise<Pet[]> {
  try {
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

