import { create, StateCreator } from 'zustand'
import { CareSlice, HealthSlice, PetSlice, ProfileSlice } from './StoreInterface'
import { createSelectors } from './storeUtils'

const createProfileSlice: StateCreator<ProfileSlice & PetSlice & CareSlice & HealthSlice, [], [], ProfileSlice> = (set) => ({
  profile: {},
  setProfile: profile => set({ profile: profile }),
  setPets: pets => set({ pets: pets }),
  setCares: cares => set({ cares: cares}),
  setHealths: healths => set({ healths: healths }),
})

const createPetSlice: StateCreator<PetSlice> = (set) => ({
  pets: [],
  onAddPet: pet => set(state => ({ pets: [...state.pets, pet] })),
  onUpdatePet: pet => set(state => ({ pets: state.pets.map(p => p._id === pet._id ? pet : p) })),
  onDeletePet: petId => set(state => ({ pets: state.pets.filter(p => p._id !== petId) }))
})

const createCareSlice: StateCreator<CareSlice> = (set) => ({
  cares: [],
  onAddCare: care => set(state => ({ cares: [...state.cares, care] })),
  onUpdateCare: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c) })),
  onDeleteCare: careId => set(state => ({ cares: state.cares.filter(c => c._id !== careId) }))
})

const createHealthSlice: StateCreator<HealthSlice> = (set) => ({
  healths: [],
    onAddHealth: health => set(state => ({ healths: [...state.healths, health] })),
    onUpdateHealth: health => set(state => ({ healths: state.healths.map(h => h._id === health._id ? health : h) })),
    onDeleteHealth: healthId => set(state => ({ healths: state.healths.filter(h => h._id !== healthId) }))
})

const useBoundStoreBase = create<ProfileSlice & PetSlice & CareSlice & HealthSlice>()((...a) => ({
  ...createProfileSlice(...a),
  ...createPetSlice(...a),
  ...createCareSlice(...a),
  ...createHealthSlice(...a),
}))

export const useBoundStore = createSelectors(useBoundStoreBase)