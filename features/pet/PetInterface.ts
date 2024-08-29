import { Frequency } from "@utils/types"

export type Gender = 'Boy' | 'Girl' | 'Unknown'
export type Species = 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Rodent' | string
export type Status = 'Healthy' | 'Passed away'

export interface PetFormData {
  name: string
  gender: Gender
  species: Species
  breed: string | null
  dob: string | null
  gotchaDate: string | null
  altered: { value: boolean, date: string | null}
  status: { value: string, date: string | null, archive: boolean }
  color: number
  photo?: string
  petId: string | null
}

export type PhotoFormData = { uri: string, name: string, type: string }

export interface Pet extends PetFormData {
  _id: string
  photo: string | null
  ids: string[] | Id[]
  services: string[] | Service[]
  medications: string[] | Medication[]
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
  addresses: string[] | null
  emails: string[] | null
  phones: string[]
  notes: string | null
  serviceId?: string
  pets?: string[]
}

export interface Service extends ServiceFormData { 
  _id: string
  creator: string
}

export type IdFormData = {
  name: string, 
  type: string, 
  no: string, 
  notes: string | null
  idId?: string | null
}
export interface Id extends IdFormData { _id: string }

type Note = {
  content: string
  createdAt?: string
}

type MedStatus = 'Active' | 'Paused' | 'Inactive'

export type Dosage = {
  dose: string, 
  startDate: string, 
  endDate: string | null,
  frequency: Frequency,
  ending?: boolean
}

export type Refill = {
  count: number, 
  frequency: Frequency 
  reminder: boolean | string
  isActive: boolean
}

export type MedicationFormData = {
  name: string
  dosages: Dosage[]
  refill: Refill | null
  isActive: boolean
  reminder: boolean | string
  notes: string
  pet: string
  medId?: string | null
}

export interface Medication extends MedicationFormData { _id: string }

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

export type DetailType = 'id' | 'service' | 'illness' | 'medication'

export type Detail = Id | Service | Illness | Medication

