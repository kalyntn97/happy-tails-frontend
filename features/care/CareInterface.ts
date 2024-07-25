import { Pet, PetBasic } from "@pet/PetInterface"
import { Frequency } from "@utils/types"

export interface CareFormData {
  name: string
  pets: string[] | PetBasic[]
  repeat: boolean
  startDate: string | Date
  endDate: string | null
  frequency: Frequency | null
  color: number
  icon?: string
  _id?: string
}
export interface Care extends CareFormData {
  _id: string
}

export interface LogFormData {
  value: number
  notes: string
  createdAt: string | Date
  task: string | Care
  _id?: string
}

export interface Log extends LogFormData {
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

type Done = {
  value: number
  notes: string
} 