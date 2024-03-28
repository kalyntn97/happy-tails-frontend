import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"

export interface Profile {
  _id: string
  name: string
  photo: string | null
  bio: string
  reminderInterval: number
}

export interface ProfileFormData {
  name: string
  bio: string
  photoData: { uri: string, name: string, type: string } | null
}