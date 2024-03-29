import axios from "axios"
import { Health, Visit } from "./HealthInterface"
import { HEALTH_BASE_URL } from "@services/urls"

const BASE_URL = HEALTH_BASE_URL

export const getAllHealths = async () => {
  return (await axios.get<Health[]>(BASE_URL)).data
}

export const create = async (pet: string, type: string, name: string, vaccine: string, times: number, frequency: string, lastDone: Visit[], nextDue: Date): Promise<Health> => {
  return (await axios.post<Health>(BASE_URL, { pet, type, name, vaccine, times, frequency, lastDone, nextDue })).data
}

export const checkDone = async (date: Date, notes: string, healthId: string): Promise<Visit> => {
  return (await axios.patch<Visit>(`${BASE_URL}/${healthId}/check`, { date, notes })).data
}

export const uncheckDone = async (healthId: string, visitId: string): Promise<string> => {
  return (await axios.patch<string>(`${BASE_URL}/${healthId}/${visitId}/uncheck`)).data
}
