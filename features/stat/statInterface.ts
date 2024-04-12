export interface Record {
  value: number
  notes: string
}

export interface Stat {
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