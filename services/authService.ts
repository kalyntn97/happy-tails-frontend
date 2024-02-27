import axios from "axios"
import { AUTH_BASE_URL } from "./urls"
export interface User {
  _id: string
  name: string
  username: string
  password: string
  profile: string
  token: string
}

const BASE_URL = AUTH_BASE_URL

export async function register(name: string, username: string, password: string) {
  try {
    const result = await axios.post(`${BASE_URL}/signup`, { name, username, password })
    return result.data
  } catch (error) {
    console.error('Register Error:', error)
  }
}

export async function login(username: string, password: string) {
  try {
    const result = await axios.post(`${BASE_URL}/login`, { username, password })
    return result.data
  } catch (error) {
    console.error('Login Error:', error)
    return { error }
  }
}

export async function logout() {
  try {
    const result = await axios.post(`${BASE_URL}/logout`)
    return result.data
  } catch (error) {
    console.error('Logout Error:', error)
    return { error }
  }
}

export async function changePassword(username: string, newPassword: string) {
  try {
    const result = await axios.patch(`${BASE_URL}/change-password`, { username, newPassword })
    return result.data
  } catch (error) {
    console.error('Change Password Error: ', error)
    return { error }
  }
}

export async function changeUsername(newUsername: string, password: string) {
  try {
    const result = await axios.patch(`${BASE_URL}/change-username`, { newUsername, password })
    return result.data
  } catch (error) {
    console.error('Change Username Error: ', error)
    return { error }
  }
}

export async function deleteAccount(username:string, password: string) {
  try {
    const result = await axios.post(`${BASE_URL}/delete-account`, { username, password })
    return result.data
  } catch (error) {
    console.error('Delete Account Error: ', error)
    return { error }
  }
}