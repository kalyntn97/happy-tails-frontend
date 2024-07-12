import { Pet } from "@pet/PetInterface"

export interface Visit {
  _id: string
  date: string
  notes: string
}

export interface VisitFormData {
  date: string
  notes: string
  healthId?: string
}

export interface DeleteVisitFormData {
  healthId: string
  visitId: string
}

export interface AddVisitNotesFormData {
  healthId: string
  visitId: string
  notes: string
  due?: boolean
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
  nextDue: Visit
}

export interface HealthFormData {
  pet: string
  name: string
  type: string
  vaccine?: string
  times?: number
  frequency?: string
  lastDone?: Visit[]
  nextDue?: Visit
  healthId?: string
}
