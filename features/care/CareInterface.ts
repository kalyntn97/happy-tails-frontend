import { Pet, PetBasic } from "@pet/PetInterface"

export type CareFrequency = {
  type: 'days' | 'weeks' | 'months' | 'years'
  interval: number
  timesPerInterval: any[]
}

type Done = {
  value: number
  notes: string
} 
export interface CareFormData {
  name: string
  pets: string[] | PetBasic[]
  repeat: boolean
  startDate: string | Date
  endDate: string | null
  frequency: CareFrequency | null
  color: number
  icon?: string
}
export interface Care extends CareFormData {
  _id: string
}
export interface Tracker {
  _id: string
  name: string
  total: number
  done: Done[]
  skipped: number
  left: number
}

export interface TrackerFormData {
  careId: string
  trackerId: string
  index: number
}