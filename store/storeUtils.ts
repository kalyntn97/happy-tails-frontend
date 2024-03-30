import { useShallow } from 'zustand/react/shallow'
import { useBoundStore, usePets } from './store'

export const usePetNames = () => useBoundStore(useShallow(state => state.pets.map(pet => pet.name)))

export const useShallowPetBasics = () => useBoundStore(useShallow(state => state.pets.map(pet => ({ _id: pet._id, name: pet.name, color: pet.color, photo: pet.photo }) )))

export const usePetIds = () => useBoundStore(useShallow(state => state.pets.map(pet => ({ _id: pet._id, name: pet.name }) )))
