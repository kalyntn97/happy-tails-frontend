import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as statService from '@stat/statService'
import { Stat, StatFormData, StatName } from "./statInterface"
import { alertError, alertSuccess } from "@utils/misc"
import { petKeyFactory } from "@pet/petQueries"

export const statKeyFactory = {
  stats: ['all-stats'],
  statById: (id: string) => [...statKeyFactory.stats, id],
  statByPet: (petId: string, stat: StatName) => [...statKeyFactory.stats, petId, stat]
}

export const useGetAllStats = () => {
  return useQuery({
    queryKey: [...statKeyFactory.stats],
    queryFn: statService.getAllStats
  })
}

export const useAddStats = (navigation) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ petId, logs }:  StatFormData) => statService.create(petId, logs),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...petKeyFactory.petById(data)] })
      return alertSuccess('Log added', navigation)
    },
    onError: (error) => alertError(error)
  })
}

export const useGetStatByPet = (petId: string, stat: StatName) => {
  return useQuery({
    queryKey: [...statKeyFactory.statByPet(petId, stat)],
    queryFn: () =>statService.getStatByPet(petId, stat)
  })
}