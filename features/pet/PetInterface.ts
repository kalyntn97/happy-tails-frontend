
export type Gender = 'Boy' | 'Girl' | 'Unknown'
export interface PetFormData {
  name: string
  gender: Gender
  species: string 
  breed: string | null
  dob: string | null
  gotchaDate: string | null
  altered: { value: boolean, date: string | null}
  status: { value: string, date: string | null, show: boolean }
  color: number
  photo: string | null
  petId: string | null
}

export type PhotoFormData = { uri: string, name: string, type: string }

export interface Pet extends PetFormData {
  _id: string
  ids: Id[]
  services: Service[]
}

export interface PetBasic {
  _id: string
  name: string
  species: string
  gender: Gender
  photo: string | null
  color: number
}

export interface PetMutationFormData {
  formData: PetFormData
  photoData: PhotoFormData | null
}

export type ServiceFormData = {
  name: string
  type: string
  address: string | null
  email: string | null
  phones: string[]
  notes: string | null
  serviceId?: string
}

export interface Service extends ServiceFormData { _id: string }

export type IdFormData = {
  name: string, 
  type: string, 
  no: string, 
  notes: string | null
}
export interface Id extends IdFormData { _id: string }

type Note = {
  content: string
  createdAt?: string
}

export type Medication = {
  _id: string
  name: string
  dosage: { amount: string, startDate: string, endDate: string | null, times: number, frequency: string, reminder: string }
  refill: { times: number, frequency: string, reminder: string } | null
  status: string
  notes: Note[]
}

export type MedicationFormData = {
  name: string
  dosage: { amount: string, startDate: string, endDate: string | null, times: number, frequency: string }
  refill: { times: number, frequency: string } | null
  status: string
  medReminder: boolean
  refillReminder: boolean
}

export type Timeline = {
  startDate: string
  endDate: string | null
  notes: Note[]
}

export type IllnessFormData = {
  name: string
  type: string
  timeline: Timeline[]
  description: string | null
  status: string
}

export interface Illness extends IllnessFormData { _id: string }

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

export type DetailType = 'ids' | 'services' | 'illnesses' | 'meds'

export type Detail = Id | Service | Illness | Medication

