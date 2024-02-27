import { ReactNode } from "react"

export interface User {
  _id: string
  name: string
  username: string
  password: string
  profile: string
  token: string
}
//AuthContext Interfaces
export interface State {
  authState: { token: string | null, authenticated: boolean | null }
}

export interface AuthContextValue extends State {
  onRegister: (name: string, username: string, password: string) => Promise<any>
  onLogin: (username: string, password: string) => Promise<any>
  onLogout: () => Promise<any>
  onDeleteAccount: (username: string, password: string) => Promise<any>
}

export interface AuthProviderProps { children: ReactNode }

export type InitializeAction = {
  type: 'INITIALIZE'
  payload: { token: string | null }
}
export type RegisterAction = {
  type: 'REGISTER'
  payload: { token: string | null }
}
export type LoginAction = {
  type: 'LOGIN'
  payload: { token: string | null }
}
export type LogoutAction = {
  type: 'LOGOUT'
}
export type DeleteAccountAction = {
  type: 'DELETE'
}
export type Action = InitializeAction | RegisterAction | LoginAction | LogoutAction | DeleteAccountAction