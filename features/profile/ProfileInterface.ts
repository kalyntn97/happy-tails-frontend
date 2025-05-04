import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"
import { Health } from "@health/HealthInterface"
import { Task } from '@task/taskInterface'

export interface Streak {
  current: number
  lastDate: Date
  longest: number
}

export interface ProfileData {
  profile: Profile
  pets: Pet[]
  tasks: Task[]
  events: Event[]
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
  photo?: string
}

export type PhotoFormData = { uri: string, name: string, type: string }

export interface ProfileMutationFormData {
  formData: ProfileFormData
  photoData: PhotoFormData | null
}