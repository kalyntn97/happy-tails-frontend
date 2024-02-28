import { useShallow } from 'zustand/react/shallow'
import { useBoundStore, usePets } from './store'

export const PetNames = useBoundStore(useShallow(state => state.pets.map(pet => pet.name)))