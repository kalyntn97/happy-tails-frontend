//npm
import { FC, ReactNode, createContext, useContext, useEffect, useReducer } from "react"
//types
import { Profile } from "../services/profileService"
//services
import * as profileService from '../services/profileService'
//context
import { useAuth } from "./AuthContext"
interface State {
  profile: Profile | null
}
interface ProfileContextValue extends State {
  updateProfile: (name: string, bio: string, photoData: { uri: string, name: string, type: string } | null) => Promise<void>
}
interface ProfileProviderProps {
  children: ReactNode
}
type InitializeAction = {
  type: 'INITIALIZE'
  payload: { profile: Profile | null }
}
type UpdateAction = {
  type: 'UPDATE'
  payload: { profile: Profile }
}
type Action = InitializeAction | UpdateAction

const initialState: State = { profile: null }

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { profile } = action.payload
    return { 
      ...state, 
      profile 
    }
  },
  UPDATE: (state: State, action: UpdateAction): State => {
    const { profile } = action.payload
    return {
      ...state,
      profile
    }
  }
}
const reducer = (state: State, action: Action): State => (
  handlers[action.type ] ? handlers[action.type](state, action) : state
)

export const ProfileContext = createContext<ProfileContextValue>({
  ...initialState,
  updateProfile: () => Promise.resolve()
})

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (context === undefined ) throw new Error('useProfile must be used within a ProfileProvider')
  return context
}
export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { authState } = useAuth()
  
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      if (authState.authenticated) {
        const profile = await profileService.show()
        dispatch({
          type: 'INITIALIZE',
          payload: { profile: profile }
        }) 
      }
    }
    initialize()
  }, [authState.authenticated])

  const updateProfile = async (name: string, bio: string, photoData: { uri: string, name: string, type: string } | null): Promise<void> => {
    const updatedProfile = await profileService.update(name, bio, photoData)
    dispatch({
      type: 'UPDATE',
      payload: { profile: updatedProfile }
    })
  }

  const value = {
    ...state,
    updateProfile,
  }

  return (
    <ProfileContext.Provider value={value}>{ children }</ProfileContext.Provider>
  )
}