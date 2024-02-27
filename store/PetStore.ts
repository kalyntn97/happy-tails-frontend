import { create } from 'zustand'
import { Pet } from '../queries/petQueries'

export interface PetStore {
  pets: Pet[],
  actions: {
    setPets: (pets: Pet[]) => void
    onAddPet: (pet: Pet) => void
    onUpdatePet: (pet: Pet) => void
    onDeletePet: (petId: string) => void
  }
}

export const usePetStore = create<PetStore>((set, get) => ({
  pets: [],
  actions: {
    setPets: pets => set({ pets: pets }),
    onAddPet: pet => set({
      pets: [...get().pets, pet]
    }),
    onUpdatePet: pet => set({
      pets: [...get().pets.map(p => p._id === pet._id ? pet : p)]
    }),
    onDeletePet: petId => set({
      pets: [...get().pets.filter(p => p._id !== petId)]
    })
  }
}))

export const usePetActions = () => usePetStore(state => state.actions)

export const usePets = () => usePetStore(state => state.pets)
