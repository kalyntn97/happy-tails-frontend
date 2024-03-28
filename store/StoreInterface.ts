import { Profile } from '@profile/ProfileInterface'
import { Pet } from '@pet/PetInterface'
import { Care } from '@care/CareInterface'
import { Health } from '@health/HealthInterface'

interface DateObject {
  date: number | null, 
  week: number | null, 
  month: number | null, 
  year: number | null
}

export interface ProfileSlice {
  profile: Profile | {}
  reminderInterval: number
  activeDate: DateObject
  currentIsActive: { 
    date: boolean, 
    week: boolean, 
    month: boolean, 
    year: boolean, 
  }
  setActions : {
    setProfile: (profile: Profile) => void
    setReminderInterval: (interval: number) => void,
    setActiveDate: (dateObj: { date: number, week: number, month: number, year: number }) => void
    setPets: (pets: Pet[]) => void
    setCares: (cares: Care[]) => void
    setHealths: (healths: Health[]) => void
    onUpdateProfile: (profile: Profile) => void
  }
}

export interface PetSlice {
  pets: Pet[],
  petActions: {
    onAddPet: (pet: Pet) => void
    onUpdatePet: (pet: Pet) => void
    onDeletePet: (petId: string) => void
  }
}

export interface CareSlice {
  cares: Care[],
  careActions: {
    onAddCare: (care: Care) => void
    onUpdateCare: (care: Care) => void
    onDeleteCare: (careId: string) => void
    onCheckDone: (care: Care) => void
    onUncheckDone: (care: Care) => void
    onCheckAllDone: (care: Care) => void
    onUncheckAllDone: (care: Care) => void
  }
}

export interface HealthSlice {
  healths: Health[],
  healthActions : {
    onAddHealth: (health: Health) => void
    onUpdateHealth: (health: Health) => void
    onDeleteHealth: (healthId: string) => void
  }
}