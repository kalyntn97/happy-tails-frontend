import { Pet, PetBasic } from '@pet/PetInterface'
import { Frequency } from "@utils/types"
export interface Task {
  _id: string
  name: string
  pets: string[] | PetBasic[]
  tags: string[]
  repeat: boolean
  startDate: Date
  endDate: Date | null
  frequency: Frequency | null
  color: number
  completions: string[]
  events: Completion[]
  notes: string | null
  icon?: string
}

export interface Completion {
  intervalLabel: string
  completedTags: { completedAt: Date, tag: string, notes: string }[]
  task: string
}
