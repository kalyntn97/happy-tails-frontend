import axios from "axios"
import { STAT_BASE_URL } from "@services/urls"
import { LogData, Stat } from "./statInterface"

const BASE_URL = STAT_BASE_URL

export const create = async (petId: string, logs: LogData[]): Promise<Stat[]> => {
 return (await axios.post<Stat[]>(BASE_URL, { petId, logs })).data
}

export const getAllStats = async (): Promise<Stat[]> => {
  return (await axios.get<Stat[]>(BASE_URL)).data
}