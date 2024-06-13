import { Profile } from '@profile/ProfileInterface'
import { Pet } from '@pet/PetInterface'
import { Care } from '@care/CareInterface'
import { Health } from '@health/HealthInterface'
export interface SettingSlice {
  activeDate: { date: number, week: number, month: number, year: number }
  currentIsActive: { date: boolean, week: boolean, month: boolean, year: boolean }
  activeTaskCounts: { care: number, health: number }
  reminderInterval: number
  displayUnits: { weight: string, food: string, water: string }
}

export interface ProfileSlice {
  profile: Profile | {}
  setActions : {
    setProfile: (profile: Profile) => void
    setActiveDate: (dateObj: { date: number, week: number, month: number, year: number }) => void
    setActiveTaskCounts: (activeTaskObj: { care: number, health: number }) => void
    setReminderInterval: (interval: number) => void,
    setDisplayUnits: (displayUnitObj: { weight: string, food: string, water: string }) => void
    setPets: (pets: Pet[]) => void
    setCares: (cares: { [key: string]: Care[] }) => void
    setHealths: (healths: Health[]) => void
    onUpdateProfile: (profile: Profile) => void
  }
  petActions: {
    onAddPet: (pet: Pet) => void
    onUpdatePet: (pet: Pet) => void
    onDeletePet: (petId: string) => void
  }
}

export interface CareSlice {
  cares: { [key: string]: Care[] }
  careActions: {
    onAddCare: (care: Care) => void
    onUpdateCare: (care: Care) => void
    onDeleteCare: (careId: string) => void
  }
}

export interface HealthSlice {
  healths: Health[]
  healthActions : {
    onAddHealth: (health: Health) => void
    onUpdateHealth: (health: Health) => void
    onDeleteHealth: (healthId: string) => void
  }
}