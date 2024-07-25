import { Pet, PetBasic, Service } from "@pet/PetInterface"
import { Frequency } from "@utils/types"

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

export interface HealthFormData {
  name: string
  details: string[]
  pet: PetBasic | string
  type: 'Routine' | 'Emergency' | 'Illness'
  repeat: boolean
  frequency?: Frequency | null
  lastDone?: Visit
  nextDue?: Visit
  icon?: number
  _id?: string
}

export interface Health extends HealthFormData {
  _id: string
}

export interface VisitFormData {
  dueDate: string
  overDue: boolean
  appointment: {
    date: string
    vet: Service
    completed: boolean
  } | null
  notes: string
  health: string | Health
  _id?: string
}

export interface Visit extends VisitFormData {
  _id: string
}