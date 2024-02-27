import { FC, ReactNode, createContext, useContext, useEffect, useReducer, useState } from "react"
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
//types & services
import * as tokenService from '@services/tokenService'
import * as authService from '@services/authService'
import { Action, AuthContextValue, AuthProviderProps, DeleteAccountAction, InitializeAction, LoginAction, LogoutAction, RegisterAction, State } from "@customTypes/AuthInterface"


const initialState: State = {
  authState: { token: null, authenticated: false }
}

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { token } = action.payload
    return {
      ...state,
      authState: { token: token, authenticated: true }
    }
  },
  REGISTER: (state: State, action: RegisterAction): State => {
    const { token } = action.payload
    return {
      ...state,
      authState: { token: token, authenticated: true }
    }
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { token } = action.payload
    return {
      ...state,
      authState: { token: token, authenticated: true }
    }
  },
  LOGOUT: (state: State, action: LogoutAction): State => {
    return {
      ...state,
      authState: { token: null, authenticated: false }
    }
  },
  DELETE: (state: State, action: DeleteAccountAction): State => {
    return {
      ...state,
      authState: { token: null, authenticated: false }
    }
  },
}

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
)

const TOKEN_KEY = 'happy-tails'
export const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  onRegister: () => Promise.resolve(),
  onLogin: () => Promise.resolve(),
  onLogout: () => Promise.resolve(),
  onDeleteAccount: () => Promise.resolve(),
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined ) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const token: string | null = await tokenService.getToken()
      console.log('file: AuthContext.tsx:138 ~ load token ~ token:', token)
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        dispatch({
          type: 'INITIALIZE',
          payload: { token: token }
        })
      }
    }
    initialize()
  }, [])

  const register = async (name: string, username: string, password: string) => {
    const { status, token, error } = await authService.register(name, username, password)
    console.log('file: AuthContext.tsx:148 ~ register ~ result:', status ?? error)
    if (token) {
      dispatch({
        type: 'REGISTER',
        payload: { token: token }
      })
    }
    return { status, error }
  }

  const login = async (username: string, password: string) => {
    const { status, token, error } = await authService.login(username, password)
    console.log('file: AuthContext.tsx:162 ~ login ~ result:', error)
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      await SecureStore.setItemAsync(TOKEN_KEY, token)
      dispatch({
        type: 'LOGIN',
        payload: { token: token }
      })
    }
    return { status, error }
  }

  const logout = async () => {
    const { status, error } = await authService.logout()
    console.log('file: AuthContext.tsx:178 ~ logout ~ result:', status ?? error)
    if (!error) {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      axios.defaults.headers.common['Authorization'] = ''
      dispatch({ type: 'LOGOUT' })
    }
    return { status, error }
  }

  const deleteAccount = async (username:string, password: string) => {
    const { status, error } = await authService.deleteAccount(username, password)
    console.log('file: AuthContext.tsx:106 ~ deleteAccount ~ result:', status ?? error)
    if (!error) {
      await SecureStore.deleteItemAsync(TOKEN_KEY)
      axios.defaults.headers.common['Authorization'] = ''
      dispatch({ type: 'DELETE' })
    }
    return { status, error }
  }

  const value = { 
    ...state,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onDeleteAccount: deleteAccount,
  }

  return (
    <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
  )
} 