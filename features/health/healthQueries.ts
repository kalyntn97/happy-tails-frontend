import { useQuery } from "@tanstack/react-query"
import * as healthService from "./healthService"

export const healthKeyFactory = {
  healths: ['all-healths']
}

export const useGetAllHealths = () => {
  return useQuery({
    queryKey: [...healthKeyFactory.healths],
    queryFn: healthService.getAllHealths
  })
}