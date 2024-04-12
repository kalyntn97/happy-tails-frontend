import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as statService from '@stat/statService'
import { StatFormData } from "./statInterface"

export const statKeyFactory = {
  stats: ['all-stats'],
  statById: (id: string) => [...statKeyFactory.stats, id],
}

export const useGetAllStats = () => {
  return useQuery({
    queryKey: [...statKeyFactory.stats],
    queryFn: statService.getAllStats
  })
}

export const useAddStats = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ petId, logs }:  StatFormData) => statService.create(petId, logs),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...statKeyFactory.stats] })
    }
  })
}