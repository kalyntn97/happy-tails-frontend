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

export interface Health {
  _id: string | null
  name: string
  details: string[]
  pet: PetBasic | string
  type: 'Routine' | 'Emergency' | 'Illness'
  repeat: boolean
  frequency: Frequency | null
  lastDone: Visit | null
  nextDue: Visit | null
  icon?: number
}

export interface Visit {
  dueDate: string
  overDue: boolean
  appointment: { date: string, vet: Service, completed: boolean } | null
  notes: string | null
  health: string | Health
  _id: string | null
}