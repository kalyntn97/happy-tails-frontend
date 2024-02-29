import axios from "axios"
import { Health } from "./HealthInterface"
import { HEALTH_BASE_URL } from "@services/urls"

const BASE_URL = HEALTH_BASE_URL

export const getAllHealths =async () => {
  return (await axios.get<Health[]>(BASE_URL)).data
}