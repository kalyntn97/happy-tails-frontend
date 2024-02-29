import { useShallow } from 'zustand/react/shallow'
import { useBoundStore, usePets } from './store'

export const usePetNames = () => useBoundStore(useShallow(state => state.pets.map(pet => pet.name)))

export const useShallowPetBasics = () => useBoundStore(useShallow(state => state.pets.map(pet => ({ name: pet.name, photo: pet.photo }) )))