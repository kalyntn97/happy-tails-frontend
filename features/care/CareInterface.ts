import { Pet } from "@pet/PetInterface"

export interface Tracker {
  _id: string
  name: string
  total: number
  done: number[]
  skipped: number
  left: number
}

export interface Care {
  _id: string
  name: string
  pets: Pet[]
  repeat: boolean
  ending: boolean
  date: Date
  endDate?: Date
  frequency?: string
  times?: number
  color: number
  trackers: Tracker[]
}

export interface CareFormData {
  name: string
  pets: string[]
  repeat: boolean
  ending: boolean
  date: Date
  endDate?: Date
  frequency: string
  times: number
  color: number
  careId?: string
}

export interface TrackerFormData {
  careId: string
  trackerId: string
  index: number
}