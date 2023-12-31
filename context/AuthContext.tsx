import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
//types & services
import { Profile } from "../services/profileService"
import * as profileService from '../services/profileService'

interface AuthProps {
  authState?: { token: string | null, authenticated: boolean | null }
  onRegister?: (name: string, username: string, password: string) => Promise<any>
  onLogin?: (username: string, password: string) => Promise<any>
  onLogout?: () => Promise<any>
}

const TOKEN_KEY = 'my-jwt'
export const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL
// export const API_URL='https://api.developbetterapps.com'
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null, authenticated: boolean | null}>({
    token: null, authenticated: null
  })

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY)
      console.log('file: AuthContext.tsx:32 ~ load token ~ token:', token)
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setAuthState({
          token: token, authenticated: true
        })
      }
    }
    loadToken()
  }, [])

  const register = async (name: string, username: string, password: string) => {
    try {
      return await axios.post(`${BASE_URL}/signup`, { name, username, password })
    } catch (error) {
      console.error('Register Error:', error);
      return { error: true, msg: (error as any).response.data.status || 'An error occurred'}
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(
        `${BASE_URL}/login`, 
        { username, password }
      )
      console.log('file: AuthContext.tsx:41 ~ login ~ result:', result)
      setAuthState({
        token: result.data.token, authenticated: true
      })
      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token)
      return result
    } catch (error) {
      console.error('Login Error:', error);
      return { error: true, msg: (error as any).response?.data || 'An error occurred' }
    }
  }

  const logout = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/logout`)
      console.log('file: AuthContext.tsx:41 ~ logout ~ result:', result)
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      axios.defaults.headers.common['Authorization'] = ''
      setAuthState({
        token: null, authenticated: false, profile: null
      })
    } catch (error) {
      console.error('Logout Error:', error);
      return { error: true, msg: (error as any).response?.data || 'An error occurred' }
    }
  }

  const value = { 
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 