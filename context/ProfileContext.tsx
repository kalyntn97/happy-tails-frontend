//npm
import { createContext, useContext, useEffect, useState} from "react"
//types
import { Profile } from "../services/profileService"
//services
import * as profileService from '../services/profileService'
import { usePetContext } from "./PetContext"

interface ProfileProps {
  profile?: Profile | null
  onEditProfile?: (name: string, bio: string, photoData: { uri: string, name: string, type: string } | null) => Promise<Profile>
}

const ProfileContext = createContext<ProfileProps>({})

export const useProfileContext = () => {
  return useContext(ProfileContext)
}

export const ProfileProvider = ({children}: any) => {
  const [profile, setProfile] = useState<Profile | null>(null)
  
  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await profileService.show()
      setProfile(profileData)
      console.log(profileData)
    }
    fetchProfile()
  }, [])
  
  const editProfile = async (name: string, bio: string, photoData: { uri: string, name: string, type: string } | null) => {
    const updatedProfile = await profileService.update(name, bio, photoData)
    setProfile(updatedProfile)
    return updatedProfile
  }

  const value = { 
    profile,
    onEditProfile: editProfile
  }

  return ( 
    <ProfileContext.Provider value={value}>
      { children }
    </ProfileContext.Provider>
  )
}

