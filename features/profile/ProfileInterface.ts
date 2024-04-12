import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"

export interface Streak {
  streak: number
  lastDate: Date
  longestStreak: number
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