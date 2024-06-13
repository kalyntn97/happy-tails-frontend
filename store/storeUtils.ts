import { useShallow } from 'zustand/react/shallow'
import { useBoundStore } from './store'

// export const usePetNames = () => useBoundStore(useShallow(state => state.profile.pets.map(pet => pet.name)))

// export const useShallowPetBasics = () => useBoundStore(useShallow(state => state.profile.pets.map(pet => ({ _id: pet._id, name: pet.name, color: pet.color, photo: pet.photo, species: pet.species }) )))

// export const usePetIds = () => useBoundStore(useShallow(state => state.profile.pets.map(pet => ({ _id: pet._id, name: pet.name }) )))

// export const useShallowCares = () => useBoundStore(useShallow(state => state.cares.map(care => ({ _id: care._id, name: care.name, pets: care.pets,frequency: care.frequency, date: care.date, endDate: care.endDate, color: care.color }))))

// export const useShallowHealths = () => useBoundStore(useShallow(state => state.healths.map(health => ({ _id: health._id, name: health.name, pet: health.pet, lastDate: health.lastDone[0]?.date, nextDue: health.nextDue }))))