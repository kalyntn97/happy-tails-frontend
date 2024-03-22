import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as healthService from "./healthService"
import { HealthFormData } from "./HealthInterface"

export const healthKeyFactory = {
  healths: ['all-healths']
}

export const useGetAllHealths = () => {
  return useQuery({
    queryKey: [...healthKeyFactory.healths],
    queryFn: healthService.getAllHealths
  })
}

export const useAddHealth = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pet, type, name, vaccine, times, frequency, lastDone, nextDue }:  HealthFormData) => healthService.create(pet, type, name, vaccine, times, frequency, lastDone, nextDue),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...healthKeyFactory.healths] })
    }
  })
}