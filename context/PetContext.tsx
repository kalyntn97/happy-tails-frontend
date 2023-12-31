//npm modules
import React, { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { Pet } from "../api/petsService"
//services
import * as petService from '../api/petsService'

//types
interface PetProps {
  pets: Pet[]
  onAddPet?: (name: string, age: number, species: string, breed: string) => Promise<any>
}

interface PetProviderProps {
  children: ReactNode
}

//define context
const PetContext = createContext<PetProps | undefined>(undefined)
//define custom hook to use context
export const usePetContext = () => {
  return useContext(PetContext)
}
//define context provider
export const PetProvider: React.FC<PetProviderProps> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([])

  useEffect(() => {
    const fetchAllPets = async () => {
      const petData = await petService.index()
      setPets(petData)
    }
    fetchAllPets()
  }, [])

  const addPet = async (name: string, age: number, species: string, breed: string) => {
    const newPet = await petService.create({ name, age, species, breed })
    setPets([...pets, newPet])
    return newPet
  }

  const values: PetProps = {
    pets,
    onAddPet: addPet
  }

  return (
    <PetContext.Provider value={values}>
      {children}
    </PetContext.Provider>
  )
}