import axios from 'axios'
import { CARE_BASE_URL } from '../../services/urls'
import { Care, Tracker } from './CareInterface'

const BASE_URL = CARE_BASE_URL

export const getAllCares = async (): Promise<{[key: string]: Care[]}> => {
  return (await axios.get<{[key: string]: Care[]}>(BASE_URL)).data
}

export const create = async (name: string, pets: string[], repeat: boolean, ending: boolean, date: Date, endDate: Date | null, frequency: string | null, times: number | null, color: number): Promise<Care>  => {
  return (await axios.post<Care>(BASE_URL, { name, pets, repeat, ending, date, endDate, frequency, times, color })).data
}

export const update = async (name: string, pets: string[], repeat: boolean, ending: boolean, date: Date, endDate: Date | null, frequency: string | null, times: number | null, color: number, careId: string): Promise<Care>  => {
  return (await axios.put<Care>(`${BASE_URL}/${careId}`, { name, pets, repeat, ending, date, endDate, frequency, times, color })).data
}

export const getCare = async (careId: string): Promise<Care>  => {
  return (await axios.get<Care>(`${BASE_URL}/${careId}`)).data
}

export const deleteCare = async (careId: string): Promise<string> => {
  return (await axios.delete<string>(`${BASE_URL}/${careId}`)).data
}

export const checkDone = async (careId: string, trackerId: string, index: number): Promise<Tracker> => {
  return (await axios.patch<Tracker>(`${BASE_URL}/${careId}/${trackerId}/check`, { index })).data
}

export const uncheckDone = async (careId: string, trackerId: string, index: number): Promise<Tracker> => {
  return (await axios.patch<Tracker>(`${BASE_URL}/${careId}/${trackerId}/uncheck`, { index })).data
}

export const checkAllDone = async (careId: string, trackerId: string, index: number): Promise<Tracker> => {
  return (await axios.patch<Tracker>(`${BASE_URL}/${careId}/${trackerId}/check-all`, { index })).data
}

export const uncheckAllDone = async (careId: string, trackerId: string, index: number): Promise<Tracker> => {
  return (await axios.patch<Tracker>(`${BASE_URL}/${careId}/${trackerId}/uncheck-all`, { index })).data
}
