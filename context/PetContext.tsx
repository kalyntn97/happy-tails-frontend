//npm modules
import React, { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { Pet } from "../services/petsService"
//services
import * as petService from '../services/petsService'

//types
interface PetProps {
  pets: Pet[]
  onAddPet?: (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => Promise<any>
  onEditPet?: (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string) => Promise<any>
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

  const addPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    const newPet = await petService.create(name, age, species, breed, photoData)
    setPets([...pets, newPet])
    return newPet
  }

  const editPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string) => {
    const updatedPet = await petService.edit(name, age, species, breed, photoData, petId)
    setPets(pets.map(pet => pet._id === updatedPet._id ? updatedPet : pet))
    return updatedPet
  }

  const values: PetProps = {
    pets,
    onAddPet: addPet,
    onEditPet: editPet
  }

  return (
    <PetContext.Provider value={values}>
      {children}
    </PetContext.Provider>
  )
}