import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as statService from '@stat/statService'
import { StatFormData } from "./statInterface"
import { alertError, alertSuccess } from "@utils/misc"
import { petKeyFactory } from "@pet/petQueries"

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