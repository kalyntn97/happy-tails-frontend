export interface Pet extends InitialPet {
  _id: string
  photo: string | null
  ids: Id[]
  services: Service[]
  medications: Medication[]
  illnesses: Illness[]
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
  address: string | null
  email: string | null
  phones: string[] | []
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
  notes: Note[] | []
}

export type MedicationFormData = {
  name: string
  dosage: { amount: string, startDate: string, endDate: string | null, times: number, frequency: string, reminder: boolean }
  refill: { times: number, frequency: string, reminder: boolean } | null
  status: string
}

export type Timeline = {
  startDate: string
  endDate: string | null
  notes: Note[] | []
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
