import { create, StateCreator } from 'zustand'
import { CareSlice, HealthSlice, PetSlice, ProfileSlice } from './StoreInterface'

const createProfileSlice: StateCreator<ProfileSlice & PetSlice & CareSlice & HealthSlice, [], [], ProfileSlice> = (set) => ({
  profile: {},
  setActions: {
    setProfile: profile => set({ profile: profile }),
    setPets: pets => set({ pets: pets }),
    setCares: cares => set({ cares: cares}),
    setHealths: healths => set({ healths: healths }),
    onUpdateProfile: profile => set({ profile: profile}),
  }
})

const createPetSlice: StateCreator<PetSlice> = (set) => ({
  pets: [],
  petActions: {
    onAddPet: pet => set(state => ({ pets: [...state.pets, pet] })),
    onUpdatePet: pet => set(state => ({ pets: state.pets.map(p => p._id === pet._id ? pet : p) })),
    onDeletePet: petId => set(state => ({ pets: state.pets.filter(p => p._id !== petId) }))
  }
})

const createCareSlice: StateCreator<CareSlice> = (set) => ({
  cares: [],
  careActions: {
    onAddCare: care => set(state => ({ cares: [...state.cares, care] })),
    onUpdateCare: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c) })),
    onDeleteCare: careId => set(state => ({ cares: state.cares.filter(c => c._id !== careId) })),
    onCheckDone: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c)})),
    onUncheckDone: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c)})),
    onCheckAllDone: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c)})),
    onUncheckAllDone: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c)})),
  }
})

const createHealthSlice: StateCreator<HealthSlice> = (set) => ({
  healths: [],
  healthActions: {
    onAddHealth: health => set(state => ({ healths: [...state.healths, health] })),
    onUpdateHealth: health => set(state => ({ healths: state.healths.map(h => h._id === health._id ? health : h) })),
    onDeleteHealth: healthId => set(state => ({ healths: state.healths.filter(h => h._id !== healthId) }))
  }
})

export const useBoundStore= create<ProfileSlice & PetSlice & CareSlice & HealthSlice>()((...a) => ({
  ...createProfileSlice(...a),
  ...createPetSlice(...a),
  ...createCareSlice(...a),
  ...createHealthSlice(...a),
}))

//states
export const useProfile = () => useBoundStore(state => state.profile)
export const usePets = () => useBoundStore(state => state.pets)
export const useCares = () => useBoundStore(state => state.cares)
export const useHealths = () => useBoundStore(state => state.healths)
//actions
export const usePetActions = () => useBoundStore(state => state.petActions)
export const useSetActions = () => useBoundStore(state => state.setActions)
export const useCareActions = () => useBoundStore(state => state.careActions)
export const useHealthActions = () => useBoundStore(state => state.healthActions)