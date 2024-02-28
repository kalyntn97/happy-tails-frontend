//npm modules
import React, { ReactNode, createContext, useContext, useState, useEffect, FC, useReducer } from "react"
import { Pet } from "@pet/PetInterface"
//services
import * as petService from '@pet/petService'

//types
interface State {
  pets: Pet[]
}
interface PetContextValue extends State {
  onAddPet: (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => Promise<any>
  onUpdatePet: (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string) => Promise<any>
  onDeletePet: (petId: string) => Promise<any>
}
interface PetProviderProps { children: ReactNode }
type InitializeAction = {
  type: 'INITIALIZE',
  payload: { pets: Pet[] }
}
type AddAction = {
  type: 'ADD',
  payload: { pet: Pet }
}
type UpdateAction = {
  type: 'UPDATE',
  payload: { pet: Pet }
}
type DeleteAction = {
  type: 'DELETE',
  payload: { pet: Pet }
}
type Action = InitializeAction | AddAction | UpdateAction | DeleteAction

const initializeState: State = { pets: [] }

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { pets } = action.payload
    return {
      ...state,
      pets: pets
    }
  },
  ADD: (state: State, action: AddAction): State => {
    const { pet } = action.payload
    return {
      ...state,
      pets: [...state.pets, pet]
    }
  },
  UPDATE: (state: State, action: UpdateAction): State => {
    const { pet } = action.payload
    return {
      ...state,
      pets: state.pets.map(p => p._id === pet._id ? pet : p)
    }
  },
  DELETE: (state: State, action: DeleteAction): State => {
    const { pet } = action.payload
    return {
      ...state,
      pets: state.pets.filter(p => p._id !== pet._id)
    }
  }
}

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
)
//define context
const PetContext = createContext<PetContextValue>({
  ...initializeState,
  onAddPet: () => Promise.resolve(),
  onUpdatePet: () => Promise.resolve(),
  onDeletePet: () => Promise.resolve()
})
//define custom hook to use context
export const usePet = () => {
  const context = useContext(PetContext)
  if (context === undefined ) throw new Error('usePet must be used within a PetProvider')
  return context
}
//define context provider
export const PetProvider: FC<PetProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initializeState)

  useEffect(() => {
    const initialize = async () => {
      const pets = await petService.index()
      dispatch({
        type: 'INITIALIZE',
        payload: { pets: pets }
      })
    }
    initialize()
  }, [])

  const addPet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null) => {
    const newPet = await petService.create(name, age, species, breed, photoData)
    dispatch({
      type: 'ADD',
      payload: { pet: newPet}
    })
  }

  const updatePet = async (name: string, age: number, species: string, breed: string, photoData: { uri: string, name: string, type: string } | null, petId: string) => {
    const updatedPet = await petService.update(name, age, species, breed, photoData, petId)
    dispatch({
      type: 'UPDATE',
      payload: { pet: updatedPet }
    })
  }

  const deletePet = async (petId: string) => {
    const deletedPet = await petService.deletePet(petId)
    dispatch({
      type: 'DELETE',
      payload: { pet: deletedPet }
    })
  }

  const value = {
    ...state,
    onAddPet: addPet,
    onUpdatePet: updatePet,
    onDeletePet: deletePet,
  }

  return (
    <PetContext.Provider value={value}>{ children }</PetContext.Provider>
  )
}