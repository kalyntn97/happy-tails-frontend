export interface Pet {
  _id: string
  name: string
  age: number
  species: string 
  breed: string
  photo: string | null
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
