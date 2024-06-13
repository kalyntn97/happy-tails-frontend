import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"
import { Health } from "@health/HealthInterface"

export interface Streak {
  streak: number
  lastDate: Date
  longestStreak: number
}

export interface ProfileData {
  profile: Profile
  healths: Health[]
  cares: { [key: string]: Care[] }
}

export interface Profile {
  _id: string
  name: string
  username: string
  photo: string | null
  banner: string | null
  bio: string
  pets: Pet[]
}

export interface ProfileFormData {
  name: string
  bio: string
  photoData: PhotoData | null
}

export type PhotoData = {
  uri: string
  name: string
  type: string 
}