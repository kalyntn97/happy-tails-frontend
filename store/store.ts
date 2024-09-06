import { create, StateCreator } from 'zustand'
import { SettingSlice } from './StoreInterface'
import { getDateInfo } from '@utils/datetime'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persist, createJSONStorage } from 'zustand/middleware'

const createSettingSlice: StateCreator<SettingSlice> = (set, get) => ({
  healthInterval: 30,
  activeDate: { 
    date: getDateInfo('today').date - 1, 
    week: getDateInfo('today').week - 1, 
    month: getDateInfo('today').month - 1, 
    year: getDateInfo('today').year 
  },
  getActiveDate: () => {
    const date = new Date(get().activeDate.year, get().activeDate.month, get().activeDate.date + 1)
    date.setHours(0, 0, 0, 0)
    return date
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
  },
  getDisplayUnit: (name) => get().displayUnits[name],
  petSettings : {},
  getPetSettings: (petId, setting) => get().petSettings[petId]?.[setting],
  setActions: {
    setHealthInterval: interval => set({ healthInterval: interval }),
    setActiveDate: dateObj => set({ activeDate: dateObj }),
    setActiveTaskCounts: activeTaskObj => set({ activeTaskCounts: activeTaskObj }),
    setDisplayUnits: (name, value) => set(state => ({ displayUnits: { ...state.displayUnits, [name]: value } })),
    setPetSettings: (petId, setting, value) => set(state => ({ petSettings: { ...state.petSettings, [petId]: { ...state.petSettings[petId], [setting]: value } } }))
  },
})

// const createProfileSlice: StateCreator<ProfileSlice & CareSlice & HealthSlice & SettingSlice, [], [], ProfileSlice> = (set, get) => ({
//   profile: {},
//   setActions: {
//     setProfile: profile => set({ profile: profile }),
//     setReminderInterval: interval => set({ reminderInterval: interval }),
//     setActiveDate: dateObj => set({ activeDate: dateObj }),
//     setActiveTaskCounts: activeTaskObj => set({ activeTaskCounts: activeTaskObj }),
//     setDisplayUnits: displayUnitObj => set({ displayUnits: displayUnitObj }),
//     setPets: pets => set(state => ({ profile: { ...state.profile, pets: pets } })),
//     setCares: cares => set({ cares: cares}),
//     setHealths: healths => set({ healths: healths }),
//     onUpdateProfile: profile => set({ profile: profile}),    
//   },
// })

// const createCareSlice: StateCreator<CareSlice> = (set) => ({
//   cares: {},
//   careActions: {
//     onAddCare: care => set(state => ({ cares: [...state.cares, care] })),
//     onUpdateCare: care => set(state => ({ cares: state.cares.map(c => c._id === care._id ? care : c) })),
//     onDeleteCare: careId => set(state => ({ cares: state.cares.filter(c => c._id !== careId) })),
//   }
// })

// const createHealthSlice: StateCreator<HealthSlice> = (set) => ({
//   healths: [],
//   healthActions: {
//     onAddHealth: health => set(state => ({ healths: [...state.healths, health] })),
//     onUpdateHealth: health => set(state => ({ healths: state.healths.map(h => h._id === health._id ? health : h) })),
//     onDeleteHealth: healthId => set(state => ({ healths: state.healths.filter(h => h._id !== healthId) }))
//   }
// })

export const useBoundStore= create<SettingSlice>()(
  persist(
    (...a) => ({
    ...createSettingSlice(...a),
    }), {
      name: 'setting-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ reminderInterval: state.healthInterval, displayUnits: state.displayUnits, petSettings: state.petSettings }),
    }
  )
)

//states
export const useHealthInterval = () => useBoundStore(state => state.healthInterval)
export const useActiveDate = () => useBoundStore(state => state.activeDate)
export const useFullActiveDate = () => useBoundStore(state => state.getActiveDate())
export const useActiveTaskCounts = () => useBoundStore(state => state.activeTaskCounts)
export const useCurrentIsActive = () => useBoundStore(state => state.currentIsActive)
export const useDisplayUnits = () => useBoundStore(state => state.displayUnits)
export const useGetDisplayUnits = (name: string) => useBoundStore(state => state.getDisplayUnit(name))
export const useGetPetSettings = (petId: string, setting: string) => useBoundStore(state => state.getPetSettings(petId, setting))
//actions
export const useSetActions = () => useBoundStore(state => state.setActions)
