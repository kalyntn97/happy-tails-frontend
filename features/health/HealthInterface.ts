import { Pet } from "@pet/PetInterface"

export interface Visit {
  _id: string
  date: Date
  notes: string
}

export interface VisitFormData {
  date: Date
  notes: string
  healthId: string
}

export interface DeleteVisitFormData {
  healthId: string
  visitId: string
}
export interface Health {
  _id: string
  pet: Pet
  name: string
  type: string
  vaccine: string
  times: number
  frequency: string
  lastDone: Visit[]
  nextDue: Date
}

export interface HealthFormData {
  pet: string
  name: string
  type: string
  vaccine?: string
  times?: number
  frequency?: string
  lastDone?: Visit[]
  nextDue?: Date
  healthId?: string
}
