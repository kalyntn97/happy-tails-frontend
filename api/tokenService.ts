import { useAuth } from "../context/AuthContext"

export const getToken = (): string => {
  const { authState } = useAuth()
  return authState?.token
}