import { STATS } from './statHelpers'

export type StatName = keyof typeof STATS
export type StatRange = 'All' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'
export interface Record {
  _id: string
  value: number
  notes: string
  createdAt: string
}

export interface Stat {
  _id: string
  pet: string
  name: string
  unit: string
  records: Record[]
}

export interface LogData {
  name: string
  value: number
  notes: string
  unit: string
}

export interface StatFormData {
  petId: string
  logs: LogData[]
}