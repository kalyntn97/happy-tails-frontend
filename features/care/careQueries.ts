import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as careService from "./careService"
import { CareFormData, TrackerFormData } from "./CareInterface"

export const careKeyFactory = {
  cares: ['all-cares'],
  careById: (id: string) => [...careKeyFactory.cares, id],
}

export const useGetAllCares = () => {
  return useQuery({
    queryKey: [...careKeyFactory.cares],
    queryFn: careService.getAllCares
  })
}

export const useGetCareById = (careId: string) => {
  return useQuery({
    queryKey: [...careKeyFactory.careById(careId)],
    queryFn: () => careService.getCare(careId)
  })
}

export const useAddCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name, frequency, times, pets }: CareFormData) => careService.create(name, frequency, times, pets),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares]})
    }
  })
}

export const useUpdateCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name, frequency, times, pets, careId }: CareFormData) => careService.update(name, frequency, times, pets, careId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares]})
    }
  })
}

export const useDeleteCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (careId: string) => careService.deleteCare(careId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares]})
    }
  })
}

export const useCheckDoneCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ careId, trackerId, index }: TrackerFormData) => careService.checkDone(careId, trackerId, index),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useUnCheckDoneCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({careId, trackerId, index}: TrackerFormData) => careService.uncheckDone(careId, trackerId, index),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}