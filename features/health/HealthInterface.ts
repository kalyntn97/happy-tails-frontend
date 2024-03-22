import { Pet } from "@pet/PetInterface"

export interface Health {
  _id: string
  pet: Pet
  name: string
  type: string
  vaccine: string
  times: number
  frequency: string
  lastDone: Date[]
  nextDue: Date
}

export interface HealthFormData {
  pet: string
  name: string
  type: string
  vaccine?: string
  times?: number
  frequency?: string
  lastDone?: Date[]
  nextDue?: Date
  healthId?: string
}