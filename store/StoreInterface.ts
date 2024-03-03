import { Profile } from '@profile/ProfileInterface'
import { Pet, PetInfo } from '@pet/PetInterface'
import { Care } from '@care/CareInterface'
import { Health } from '@health/HealthInterface'

export interface ProfileSlice {
  profile: Profile | {}
  setActions : {
    setProfile: (profile: Profile) => void
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
  activeCareFeed: number | null,
  activeCareDate: number | null,
  careActions: {
    setActiveCareFeed: (index: number ) => void
    setActiveCareDate: (index: number ) => void
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