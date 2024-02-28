import * as SecureStore from 'expo-secure-store'
import base64 from 'base-64'

const TOKEN_KEY = 'happy-tails'

export async function getToken(): Promise<string | null> {
  let token: string = await SecureStore.getItemAsync(TOKEN_KEY)
  if (!token) {
    console.log('No token stored. Logging out...')
    return null
  }
  if (!tokenIsValid(token)) {
    console.log('Token is expired or invalid. Logging out...')
    return null
  }
  return token
}

export function tokenIsValid(token: string): boolean {
  try {
    const expirationTime = JSON.parse(base64.decode(token.split('.')[1])).exp * 1000
    if (!expirationTime) {
      console.error('Invalid token structure.')
      return false
    }
    return new Date(expirationTime) > new Date()
  } catch (error) {
    console.error('Error decoding token: ', error)
    return false
  }
}