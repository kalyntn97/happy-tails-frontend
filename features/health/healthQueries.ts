import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as healthService from "./healthService"
import { AddVisitNotesFormData, DeleteVisitFormData, HealthFormData, VisitFormData } from "./HealthInterface"
import { profileKeyFactory } from "@profile/profileQueries"
import { ProfileData } from "@profile/ProfileInterface"

export const healthKeyFactory = {
  healths: ['all-healths'],
  healthById: (id: string) => [...healthKeyFactory.healths, id],
}

export const useGetAllHealths = () => {
  const queryClient = useQueryClient()
  const healthsCache = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile()).healths

  return useQuery({
    queryKey: [...healthKeyFactory.healths],
    queryFn: healthService.getAllHealths,
    enabled: !healthsCache,
  })
}

export const useGetHealthById = (healthId: string) => {
  return useQuery({
    queryKey: [...healthKeyFactory.healthById(healthId)],
    queryFn: () => healthService.getHealthById(healthId),
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
    mutationFn: ({ notes, due, healthId, visitId }: AddVisitNotesFormData) => healthService.addVisitNotes(notes, due, healthId, visitId),
    onSuccess: (data) => {
      return queryClient.invalidateQueries({ queryKey: healthKeyFactory.healthById(data._id) })
    }
  })
}