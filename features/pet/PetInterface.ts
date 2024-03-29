export interface Pet {
  _id: string
  name: string
  age: number
  species: string 
  breed: string
  photo: string | null
  color: number
}

export interface PetBasic {
  name: string
  photo: string | null
}

export interface PetFormData {
  name: string
  age: number
  species: string 
  breed: string
  color: number
  photoData: { uri: string, name: string, type: string } | null
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
