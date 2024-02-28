import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { Care } from "@care/CareInterface"
import * as careService from '@care/careService'

interface CareProps {
  careCards: Care[]
  onAddCare?: (name: string, frequency: string, times: number, pets: string[]) => Promise<any>
  onEditCare?: (name: string, frequency: string, times: number, pets: string[], careId: string) => Promise<any>
  onDeleteCare?: (careId: string) => Promise<any>
  onCheckDone?: (careId: string, trackerId: string, index: number) => Promise<any>
  onUncheckDone?: (careId: string, trackerId: string, index: number) => Promise<any>
  onCheckAllDone?: (careId: string, trackerId: string, index: number) => Promise<any>
  onUncheckAllDone?: (careId: string, trackerId: string, index: number) => Promise<any>
}

interface CareProviderProps {
  children: ReactNode
}

const CareContext = createContext<CareProps | undefined>(undefined)

export const useCareContext = () => {
  return useContext(CareContext)
}

export const CareProvider: React.FC<CareProviderProps> = ({ children }) => {
  const [careCards, setCareCards] = useState<Care[]>([])

  const editCare = async (name: string, frequency: string, times: number, pets: string[], careId: string) => {
    const updatedCareCard = await careService.update(name, frequency, times, pets, careId)
    setCareCards(prev => prev.map(care => care._id === updatedCareCard._id ? updatedCareCard : care))
    return updatedCareCard
  }

  const addCare = async (name: string, frequency: string, times: number, pets: string[]) => {
    const newCareCard = await careService.create(name, frequency, times, pets)
    setCareCards([...careCards, newCareCard])
  }

  const deleteCare = async (careId: string) => {
    const deletedCareCard = await careService.deleteCareCard(careId)
    setCareCards(careCards.filter(care => care._id !== deletedCareCard._id))
  }

  const checkDone = async (careId: string, trackerId: string, index: number) => {
    const updatedTracker = await careService.checkDone(careId, trackerId, index)
    setCareCards(prev => 
      prev.map(c => c._id === careId 
        ? {...c, trackers: c.trackers.map(t =>
            t._id === trackerId ? updatedTracker : t
          )}
        : c
      )
    )
    return updatedTracker
  }

  const uncheckDone = async (careId: string, trackerId: string, index: number) => {
    const updatedTracker = await careService.uncheckDone(careId, trackerId, index)
    setCareCards(prev => 
      prev.map(c => c._id === careId 
        ? {...c, trackers: c.trackers.map(t =>
            t._id === trackerId ? updatedTracker : t
          )}
        : c
      )
    )
    return updatedTracker
  }

  const checkAllDone = async (careId: string, trackerId: string, index: number) => {
    const updatedTracker = await careService.checkAllDone(careId, trackerId, index)
    setCareCards(prev => 
      prev.map(c => c._id === careId 
        ? {...c, trackers: c.trackers.map(t =>
            t._id === trackerId ? updatedTracker : t
          )}
        : c
      )
    )
    return updatedTracker
  }

  const uncheckAllDone = async (careId: string, trackerId: string, index: number) => {
    const updatedTracker = await careService.uncheckAllDone(careId, trackerId, index)
    setCareCards(prev => 
      prev.map(c => c._id === careId 
        ? {...c, trackers: c.trackers.map(t =>
            t._id === trackerId ? updatedTracker : t
          )}
        : c
      )
    )
    return updatedTracker
  }

  useEffect(() => {
    const fetchCareCards = async () => {
      const data = await careService.index()
      setCareCards(data)
    }
    fetchCareCards()
  }, [])
  
  const value: CareProps = {
    careCards,
    onAddCare : addCare,
    onEditCare: editCare,
    onDeleteCare: deleteCare,
    onCheckDone: checkDone,
    onUncheckDone: uncheckDone,
    onCheckAllDone: checkAllDone,
    onUncheckAllDone: uncheckAllDone,
  }

  return (
    <CareContext.Provider value={value}>{children}</CareContext.Provider>
  )
}