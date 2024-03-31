import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"

export interface Profile {
  _id: string
  name: string
  username: string
  photo: string | null
  banner: string | null
  bio: string
  reminderInterval: number
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