type License = {
  name: string
  number: string
}

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
export interface Pet {
  _id: string
  name: string
  species: string 
  breed: string
  dob: Date | null
  firstMet: Date | null
  altered: { value: boolean, date: Date | null}
  status: { value: string, date: Date | null, show: boolean }
  photo: string | null
  // icon: number | null
  color: number
  microchip: string | null
  licenses: License[]
  services: Service[]
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
