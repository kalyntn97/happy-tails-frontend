import * as SecureStore from 'expo-secure-store'
import JWT from 'expo-jwt'

const TOKEN_KEY = 'my-jwt'

export async function getToken(): Promise<string | null> {
  let token: string = await SecureStore.getItemAsync(TOKEN_KEY)
  console.log('token func', token)
  return token
}

export async function checkTokenExpiration(): Promise<boolean> {
  const storedToken = await getToken()
  const expirationTime = await getExpirationTime(storedToken)
  if (new Date(expirationTime) < new Date()) {
    console.log('Token is expired. Logging out')
    return true
  }
  console.log('Token is not expired.')
  return false
}

export async function getExpirationTime(token: string): Promise<number> {
  const decoded = JWT.decode(token, TOKEN_KEY)
  console.log(decoded)
  return decoded.exp * 1000 //s to ms
}