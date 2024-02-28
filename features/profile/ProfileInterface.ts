import { Pet } from "../pet/PetInterface"
import { Care } from "../care/CareInterface"

export interface Profile {
  _id: string
  name: string
  photo: string | null
  bio: string
  pets: Pet[]
  careCards: Care[]
}