import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as healthService from "./healthService"
import { AddVisitNotesFormData, DeleteVisitFormData, HealthFormData, VisitFormData } from "./HealthInterface"

export const healthKeyFactory = {
  healths: ['all-healths'],
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

export const useUpdateHealth = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pet, type, name, vaccine, times, frequency, lastDone, nextDue, healthId }:  HealthFormData) => healthService.update(pet, type, name, vaccine, times, frequency, lastDone, nextDue, healthId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...healthKeyFactory.healths] })
    }
  })
}

export const useDeleteHealth = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (healthId: string) => healthService.deleteHealth(healthId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...healthKeyFactory.healths] })
    }
  })
}

export const useCheckDoneHealth = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ date, notes, healthId }: VisitFormData) => healthService.checkDone(date, notes, healthId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...healthKeyFactory.healths] })
    }
  })
}

export const useUncheckDoneHealth = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ healthId, visitId }: DeleteVisitFormData) => healthService.uncheckDone(healthId, visitId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...healthKeyFactory.healths] })
    }
  })
}

export const useAddVisitNotes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ notes, healthId, visitId }: AddVisitNotesFormData) => healthService.addVisitNotes(notes, healthId, visitId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...healthKeyFactory.healths] })
    }
  })
}