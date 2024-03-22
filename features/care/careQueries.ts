import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as careService from "./careService"
import { CareFormData, TrackerFormData } from "./CareInterface"
import { useSetActions } from "@store/store"

export const careKeyFactory = {
  cares: ['all-cares'],
  careById: (id: string) => [...careKeyFactory.cares, id],
}

export const useGetAllCares = () => {
  return useQuery({
    queryKey: [...careKeyFactory.cares],
    queryFn: careService.getAllCares,
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
    mutationFn: ({ name, pets, repeat, ending, date, endDate, frequency, times }: CareFormData) => careService.create(name, pets, repeat, ending, date, endDate, frequency, times),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useUpdateCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name, pets, repeat, ending, date, endDate, frequency, times, careId }: CareFormData) => careService.update(name, pets, repeat, ending, date, endDate, frequency, times, careId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useDeleteCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (careId: string) => careService.deleteCare(careId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
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

export const useUncheckDoneCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({careId, trackerId, index}: TrackerFormData) => careService.uncheckDone(careId, trackerId, index),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useCheckAllDoneCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ careId, trackerId, index }: TrackerFormData) => careService.checkAllDone(careId, trackerId, index),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useUncheckAllDoneCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({careId, trackerId, index}: TrackerFormData) => careService.uncheckAllDone(careId, trackerId, index),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}