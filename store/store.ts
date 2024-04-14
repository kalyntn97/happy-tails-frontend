import { create, StateCreator } from 'zustand'
import { CareSlice, HealthSlice, PersistSettingSlice, PetSlice, ProfileSlice, SettingSlice } from './StoreInterface'
import { getDateInfo } from '@utils/datetime'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist, createJSONStorage } from 'zustand/middleware'


const createProfileSlice: StateCreator<ProfileSlice & PetSlice & CareSlice & HealthSlice & SettingSlice, [], [], ProfileSlice> = (set) => ({
  profile: {},
  setActions: {
    setProfile: profile => set({ profile: profile }),
    setReminderInterval: interval => set({ reminderInterval: interval }),
    setActiveDate: dateObj => set({ activeDate: dateObj }),
    setActiveTaskCounts: activeTaskObj => set({ activeTaskCounts: activeTaskObj }),
    setDisplayUnits: displayUnitObj => set({ displayUnits: displayUnitObj }),
    setPets: pets => set({ pets: pets }),
    setCares: cares => set({ cares: cares}),
    setHealths: healths => set({ healths: healths }),
    onUpdateProfile: profile => set({ profile: profile}),    
  }
})

const createSettingSlice: StateCreator<SettingSlice> = (set, get) => ({
  reminderInterval: 30,
  activeDate: { 
    date: getDateInfo('today').date - 1, 
    week: getDateInfo('today').week - 1, 
    month: getDateInfo('today').month - 1, 
    year: getDateInfo('today').year 
  },
  currentIsActive: {
    get date() { return get().activeDate.date + 1 === getDateInfo('today').date },
    get week() { return get().activeDate.week + 1 === getDateInfo('today').week },
    get month() { return get().activeDate.month + 1 === getDateInfo('today').month },
    get year() { return get().activeDate.year === getDateInfo('today').year },
  },
  activeTaskCounts: {
    care: 0,
    health: 0,
  },
  displayUnits: { 
    weight: 'kg',
    food: 'g',
    water: 'ml',
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

export const useBoundStore= create<ProfileSlice & PetSlice & CareSlice & HealthSlice & SettingSlice>()(
  persist(
    (...a) => ({
    ...createProfileSlice(...a),
    ...createPetSlice(...a),
    ...createCareSlice(...a),
    ...createHealthSlice(...a),
    ...createSettingSlice(...a),
    }), {
      name: 'setting-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ reminderInterval: state.reminderInterval, displayUnits: state.displayUnits }),
    }
  )
)

//states
export const useProfile = () => useBoundStore(state => state.profile)
export const useReminderInterval = () => useBoundStore(state => state.reminderInterval)
export const useActiveDate = () => useBoundStore(state => state.activeDate)
export const useActiveTaskCounts = () => useBoundStore(state => state.activeTaskCounts)
export const useCurrentIsActive = () => useBoundStore(state => state.currentIsActive)
export const useDisplayUnits = () => useBoundStore(state => state.displayUnits)
export const usePets = () => useBoundStore(state => state.pets)
export const useCares = () => useBoundStore(state => state.cares)
export const useHealths = () => useBoundStore(state => state.healths)
//actions
export const usePetActions = () => useBoundStore(state => state.petActions)
export const useSetActions = () => useBoundStore(state => state.setActions)
export const useCareActions = () => useBoundStore(state => state.careActions)
export const useHealthActions = () => useBoundStore(state => state.healthActions)