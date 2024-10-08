import axios from 'axios'
import { CARE_BASE_URL } from '../../services/urls'
import { Care, CareFormData, Log, LogFormData, Tracker } from './CareInterface'

const BASE_URL = CARE_BASE_URL

export const getAllCares = async (): Promise<{[key: string]: Care[]}> => {
  return (await axios.get<{[key: string]: Care[]}>(BASE_URL)).data
}

export const create = async (formData: CareFormData): Promise<Care>  => {
  return (await axios.post<Care>(BASE_URL, formData)).data
}

export const update = async (formData: CareFormData): Promise<Care>  => {
  return (await axios.put<Care>(`${BASE_URL}/${formData.careId}`, formData)).data
}

export const getCare = async (careId: string): Promise<Care>  => {
  return (await axios.get<Care>(`${BASE_URL}/${careId}`)).data
}

export const deleteCare = async (careId: string): Promise<string> => {
  return (await axios.delete<string>(`${BASE_URL}/${careId}`)).data
}

export const createLog = async (formData: LogFormData): Promise<Log> => {
  return (await axios.post<Log>(`${BASE_URL}/${formData.care}/logs`, formData)).data
}

export const updateLog = async (formData: LogFormData): Promise<Log> => {
  return (await axios.patch<Log>(`${BASE_URL}/${formData.care}/logs/${formData.logId}`, formData)).data
}

export const deleteLog = async (logId: string, careId: string): Promise<Log> => {
  return (await axios.delete<Log>(`${BASE_URL}/${careId}/logs/${logId}`)).data
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
