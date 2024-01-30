import * as SecureStore from 'expo-secure-store'
import JWT from 'expo-jwt'

const TOKEN_KEY = 'my-jwt'

export async function getToken(): Promise<string | null> {
  let token: string = await SecureStore.getItemAsync(TOKEN_KEY)
  return token
}

export async function checkTokenExpiration(): Promise<boolean> {
  try {
    const storedToken = await getToken()
    console.log('stored', storedToken)
    if (!storedToken) {
      console.log('No Token found.')
      return true
    }
    const expirationTime = getExpirationTime(storedToken)
    console.log('exp time', expirationTime)
    if (new Date(expirationTime) < new Date()) {
      console.log('Token is expired. Logging out')
      return true
    }
    if (!expirationTime) {
      console.log('Token error. Logging out.')
      return true
    }
    console.log('Token is not expired.')
    return false
  } catch (error) {
    console.log('Error checking token expiration', error)
  }

}

export function getExpirationTime(token: string): number {
  try {
    const decoded = JWT.decode<Record<string, number>>(token, TOKEN_KEY)
    if (decoded) {
      console.log('decoded tokenService', decoded)
      return decoded.exp * 1000 //s to ms
    } else {
      console.log('Invalid token structure', decoded)
    }
  } catch (error) {
    console.log('Error decoding token', error)
  }
}