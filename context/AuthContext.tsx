import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
//types & services
import * as tokenService from '../services/tokenService'

interface AuthProps {
  authState?: { token: string | null, authenticated: boolean | null }
  onRegister?: (name: string, username: string, password: string) => Promise<any>
  onLogin?: (username: string, password: string) => Promise<any>
  onLogout?: () => Promise<any>
  onChangePassword?: (username: string, newPassword: string) => Promise<any>
  onChangeUsername?: (newUsername: string, password: string) => Promise<any>
  onDeleteAccount?: (username: string, password: string) => Promise<any>
}

const TOKEN_KEY = 'happy-tails'
export const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL
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
      const token: string| null = await tokenService.getToken()
      console.log('file: AuthContext.tsx:31 ~ load token ~ token:', token)
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
      console.error('Register Error:', error)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${BASE_URL}/login`, { username, password })
      console.log('file: AuthContext.tsx:58 ~ login ~ result:', result)

      axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`
      setAuthState({
        token: result.data.token, authenticated: true
      })
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token)
      return result
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  const logout = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/logout`)
      console.log('file: AuthContext.tsx:74 ~ logout ~ result:', result)

      await SecureStore.deleteItemAsync(TOKEN_KEY)
      axios.defaults.headers.common['Authorization'] = ''
      setAuthState({
        token: null, authenticated: false
      })
    } catch (error) {
      console.error('Logout Error:', error)
    }
  }

  const changePassword = async (username: string, newPassword: string) => {
    try {
      const result = await axios.patch(`${BASE_URL}/change-password`, { username, newPassword })
      console.log('file: AuthContext.tsx:84 ~ changePassword ~ result:', result)
      return result
    } catch (error) {
      console.error('Change Password Error: ', error)
    }
  }

  const changeUsername = async (newUsername: string, password: string) => {
    try {
      const result = await axios.patch(`${BASE_URL}/change-username`, { newUsername, password })
      console.log('file: AuthContext.tsx:95 ~ changePassword ~ result:', result)
      return result
    } catch (error) {
      console.error('Change Username Error: ', error)
    }
  }

  const deleteAccount = async (username:string, password: string) => {
    try {
      const result = await axios.post(`${BASE_URL}/delete-account`, { username, password })
      console.log('file: AuthContext.tsx:106 ~ deleteAccount ~ result:', result)
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      axios.defaults.headers.common['Authorization'] = ''
      setAuthState({
        token: null, authenticated: false
      })
      return result
    } catch (error) {
      console.error('Delete Account Error: ', error)
    }
  }


  const value = { 
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onChangePassword: changePassword,
    onChangeUsername: changeUsername,
    onDeleteAccount: deleteAccount,
    authState,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 