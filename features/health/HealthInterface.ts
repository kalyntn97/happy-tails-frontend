import { Pet } from "@pet/PetInterface"

export interface Health {
  _id: string
  pet: Pet
  name: string
  vaccine: string
  type: string
  times: number
  frequency: string
  lastDone: Date
  nextDue: Date
}