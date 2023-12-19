const BASE_URL = `${process.env.EXPO_PUBLIC_BACKEND_URL}/pets`

export async function index(authToken: string) {

  try {
    const res = await fetch(BASE_URL, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    })
    return res.json()
  } catch (error) {
    console.log(error)
  }
}

