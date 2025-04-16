import { Pet, PetBasic } from "@pet/PetInterface"
import { Frequency } from "@utils/types"

export interface CareFormData {
  name: string
  pets: string[] | PetBasic[]
  repeat: boolean
  frequency: Frequency | null
  startDate: string
  endDate: string | null
  color: number
  careId: string | null
}
export interface Care extends CareFormData {
  _id: string
  logs: string[] | Log[]
}

export interface LogFormData {
  date: string
  value?: number
  notes?: { value: string, time: string }[]
  care: string
  logId?: string | null
}
export interface Log extends LogFormData {
  _id: string
}

