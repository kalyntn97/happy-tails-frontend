import { Pet } from "./PetInterface"
import { Care } from "./CareInterface"

export interface Profile {
  _id: string
  name: string
  photo: string | null
  bio: string
  pets: Pet[]
  careCards: Care[]
}