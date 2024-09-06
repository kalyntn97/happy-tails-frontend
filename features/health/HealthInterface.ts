import { Pet, PetBasic, Service } from "@pet/PetInterface"
import { Frequency } from "@utils/types"

type HealthType = 'Routine' | 'Illness' | 'Emergency'
type Appointment = {
  date: string
  vet: Service
  completed: boolean
}

export interface HealthFormData {
  name: string
  details: { [key: string]: string }
  pet: PetBasic
  repeat: boolean
  frequency: Frequency | null
  type: HealthType
  lastDone: Visit[] | []
  nextDue: Visit | null
  healthId: string | null
}
export interface Health extends HealthFormData {
  _id: string
}

export interface VisitFormData {
  dueDate: string
  overDue: boolean
  appointment: Appointment | null
  notes: string | null
  health: string | Health
  visitId: string | null
}
export interface Visit extends VisitFormData {
  _id: string | null
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