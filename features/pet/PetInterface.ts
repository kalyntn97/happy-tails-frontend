export type Service = {
  name: string
  type: string
  address?: string
  phone?: string
  email?: string
  notes?: string
}
type Stat = {
  name: string
  date: Date
  record: number
  unit: string
  notes?: string
}

export type IdFormData = {
  name: string, 
  registry: string, 
  no: string, 
  notes: string 
}
export interface Id extends IdFormData {
  _id: string,
}

type Note = {
  content: string
  createdAt: string
}

export type Medication = {
  name: string
  dosage: { amount: string, startDate: string, endDate: string, times: number, frequency: string, reminder: string }
  refill: { times: number, frequency: string, reminder: string }
  status: string
  notes: Note[]
}

export type MedicationFormData = {
  name: string
  dosage: { amount: string, startDate: string, endDate: string, times: number, frequency: string, reminder: boolean }
  refill: { times: number, frequency: string, reminder: boolean }
  status: string
}

export type Timeline = {
  startDate: string
  endDate: string
}

export type Disease = {
  name: string
  type: string
  timeline: Timeline[]
  description: string
  status: string
  notes: Note[]
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
