import { Pet } from "@pet/PetInterface"

export type CareFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Others'

type Done = {
  value: number
  notes: string
} 
export interface Tracker {
  _id: string
  name: string
  total: number
  done: Done[]
  skipped: number
  left: number
}

export interface Care {
  _id: string
  name: string
  medication: { name: string, amount?: string } | null
  pets: Pet[]
  repeat: boolean
  date: string
  endDate: string | null
  frequency: CareFrequency | null
  times: number | null
  color: number
  trackers: Tracker[]
}

export interface CareFormData {
  name: string
  pets: string[] | Pet[]
  repeat: boolean
  date: Date
  endDate: Date | null
  frequency: string | null
  times: number | null
  color: number
  careId?: string
}

export interface TrackerFormData {
  careId: string
  trackerId: string
  index: number
}