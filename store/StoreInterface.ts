import { Profile } from '@profile/ProfileInterface'
import { Pet } from '@pet/PetInterface'
import { Care } from '@care/CareInterface'
import { Health } from '@health/HealthInterface'

export interface ProfileSlice {
  profile: Profile | {}
  setActions : {
    setProfile: (profile: Profile) => void
    setPets: (pets: Pet[]) => void
    setCares: (cares: Care[]) => void
    setHealths: (healths: Health[]) => void
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