type Service = {
  name: string
  contact: { address?: string, phone?: string, fax?: string } | null
  notes?: string
}
type Stat = {
  name: string
  date: Date
  record: number
  unit: string
  notes?: string
}
export type Id = { 
  name: string, 
  registry: string, 
  no: string, 
  notes: string 
}
type Dose = {
  date: string
  notes: string
}
export type Medication = {
  name: string
  dosage: { amount: string, times: number, frequency: string, repeat: boolean, startDate: string, endDate: string }
  refill: { times: number, frequency: string, dates: string[] }
  doses: Dose[]
  status: string
  reminder: boolean
}
type Timeline = {
  startDate: string
  endDate: string
}
type Note = {
  content: string
  createdAt: string
}
type Disease = {
  name: string
  type: string
  timeline: Timeline[]
  description: string
  notes: Note[]
  status: string
}
export interface Pet {
  _id: string
  name: string
  species: string 
  breed: string
  dob: string | null
  firstMet: string | null
  altered: { value: boolean, date: string | null}
  status: { value: string, date: string | null, show: boolean }
  photo: string | null
  // icon: number | null
  color: number
  ids: Id[]
  services: Service[]
  medications: Medication[]
  diseases: Disease[]
  stats: Stat[]
}

export interface PetBasic {
  name: string
  photo: string | null
}

export interface PetFormData {
  name: string
  species: string 
  breed: string
  dob: Date | null
  firstMet: Date | null
  altered: { value: boolean, date: Date | null }
  status: { value: string, date: Date | null, show: boolean }
  photoData: { uri: string, name: string, type: string } | null
  color: number
  petId?: string
}

export interface DogBreedListResponse {
  message: Record<string, string[]>;
  status: string;
}

export interface CatBreed {
  name: string
}

export interface BirdListResponse {
  commonFeederBirds: Array<{commonNameEnglish: string}>
}
