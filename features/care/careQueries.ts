import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as careService from "./careService"
import { Care, CareFormData, TrackerFormData } from "./CareInterface"
import { alertError, alertSuccess, showToast } from "@utils/misc"
import { profileKeyFactory } from "@profile/profileQueries"
import { ProfileData } from "@profile/ProfileInterface"

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

export const useAddCare = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: CareFormData) => careService.create(formData),
    onSuccess: (data: Care) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return { ...oldData, cares: { ...oldData.cares, [data.frequency || 'Others']: [ ...oldData.cares[data.frequency || 'Others'], data] } }
      })
      navigation.navigate('Main')
      showToast({ text1: 'Task added.', style: 'success' })
    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUpdateCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ name, pets, repeat, ending, date, endDate, frequency, times, color, careId }: CareFormData) => careService.update(name, pets, repeat, ending, date, endDate, frequency, times, color, careId),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useDeleteCare = (navigation: any) => {
  
  return useMutation({
    mutationFn: (careId: string) => careService.deleteCare(careId),
    onSuccess: () => {
      navigation.navigate('Main')
      return alertSuccess('Care card deleted!')
    },
    onError: (error) => alertError(error)
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
      // return queryClient.invalidateQueries({ queryKey: [...careKeyFactory.cares] })
    }
  })
}

export const useCheckAllDoneCare = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ careId, trackerId, index }: TrackerFormData) => careService.checkAllDone(careId, trackerId, index),
    onSuccess: (data) => {
      // queryClient.setQueryData(careKeyFactory.)
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