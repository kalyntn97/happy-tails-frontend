//types
import { ImageSourcePropType } from "react-native"

interface DogBreedListResponse {
  message: Record<string, string[]>
  status: string
}

export const getIconSource = (species: string): ImageSourcePropType => {
  switch (species) {
    case 'dog':
      return require('../assets/icons/dog.png')
    case 'cat':
      return require('../assets/icons/cat.png')
    case 'bird':
      return require('../assets/icons/bird.png')
    case 'others':
      return require('../assets/icons/animal.png')
  }
}

const getDogBreedList = async (): Promise<DogBreedListResponse> => {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/list/all')
    return res.json()
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch dog breed list')
  }
}

export const getDogBreedData = async (): Promise<string[]> => {
  const rawData = await getDogBreedList()
  const data = rawData.message
  const formattedData = Object.entries(data).flatMap(( [breed, subBreeds] ) => {
    return subBreeds.map(subBreed => (
      `${subBreed.charAt(0).toUpperCase() + subBreed.slice(1)} ${breed.charAt(0).toUpperCase() + breed.slice(1)}`
    ))
  })
  return formattedData
}

export const speciesData = [ 'Dog', 'Cat', 'Bird', 'Others']