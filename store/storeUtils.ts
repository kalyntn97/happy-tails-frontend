import { useShallow } from 'zustand/react/shallow'
import { useBoundStore, usePets } from './store'

export const usePetNames = () => useBoundStore(useShallow(state => state.pets.map(pet => pet.name)))

export const useShallowPets = () => useBoundStore(useShallow(state => state.pets))