//npm
import { FC, ReactNode, createContext, useContext, useEffect, useReducer } from "react"
//types
import { Profile } from "../services/profileService"
//services
import * as profileService from '../services/profileService'
interface State {
  profile: Profile | {}
}
interface ProfileContextValue extends State {
  updateProfile: (name: string, bio: string, photoData: { uri: string, name: string, type: string } | null) => Promise<void>
}
interface ProfileProviderProps {
  children: ReactNode
}
type InitializeAction = {
  type: 'INITIALIZE'
  payload: { profile: Profile | {} }
}
type UpdateAction = {
  type: 'UPDATE'
  payload: { profile: Profile }
}
type Action = InitializeAction | UpdateAction

const initialState: State = { profile: {} }
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

export const useProfile = () => useContext(ProfileContext)

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const profile = await profileService.show()
        dispatch({
          type: 'INITIALIZE',
          payload: { profile: profile }
        })
      } catch (error) {
        console.error(error)
        dispatch({
          type: 'INITIALIZE',
          payload: { profile: {} }
        })
      }
    }
    initialize()
  }, [])

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