import { Pet } from "./petService"

//types
export interface Tracker {
  _id: string
  name: string
  total: number
  done: number
  skipped: number
  left: number
}

export interface Care {
  _id: string
  pets: Pet[]
  name: string
  times: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  trackers: Array<string>
}
