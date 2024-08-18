import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"
import { Health } from "@health/HealthInterface"

export interface Streak {
  current: number
  lastDate: Date
  longest: number
}

export interface ProfileData {
  profile: Profile
  pets: Pet[]
  cares: Care[]
  healths: Health[]
}

export interface Profile {
  _id: string
  name: string
  username: string
  photo: string | null
  banner: string | null
  bio: string
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