export interface Pet extends InitialPet {
  _id: string
  photo: string | null
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
export interface InitialPet {
  name: string
  species: string 
  breed: string
  dob: string | null
  firstMet: string | null
  altered: { value: boolean, date: string | null}
  status: { value: string, date: string | null, show: boolean }
  color: number
}

export interface InitialPetValues extends InitialPet {
  photo: string | null
  petId: string
}

export type PhotoFormData = { uri: string, name: string, type: string } | null

export interface PetFormData extends InitialPet {
  photoData: PhotoFormData
  petId?: string
}

export type ServiceFormData = {
  name: string
  type: string
  address?: string
  email?: string
  phones?: string[]
  notes?: string
  serviceId?: string
}

export interface Service extends ServiceFormData {
  _id: string,
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

type Stat = {
  name: string
  date: Date
  record: number
  unit: string
  notes?: string
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
