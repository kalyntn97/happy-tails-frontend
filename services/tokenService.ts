import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'my-jwt'

export async function getToken(): Promise<string | null> {
  let token: string = await SecureStore.getItemAsync(TOKEN_KEY)
  console.log('token func', token)
  // if (!token) return null
  // const payload = jwt_decode(token)
  // if (payload.exp < Date.now() / 1000) {
  //   await SecureStore.deleteItemAsync(TOKEN_KEY)
  //   token = null
  // }
  return token
}

