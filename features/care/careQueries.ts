import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as careService from "./careService"
import { Care, CareFormData, Tracker, TrackerFormData } from "./CareInterface"
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
      showToast({ text1: `Task added.`, style: 'success' })
    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUpdateCare = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: CareFormData) => careService.update(formData),
    onSuccess: (data: Care) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return { ...oldData, cares: { ...oldData.cares, [data.frequency 
        || 'Others']: oldData.cares[data.frequency || 'Others'].map(care => care._id === data._id ? data : care) } }
      })
      navigation.navigate('Main')
      showToast({ text1: `Task updated.`, style: 'success' })
    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeleteCare = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (careId: string) => careService.deleteCare(careId),
    onSuccess: (data: Care) => {
      queryClient.setQueryData(profileKeyFactory.profile, (oldData: ProfileData) => {
        return { ...oldData, cares: { ...oldData.cares, [data.frequency 
        || 'Others']: oldData.cares[data.frequency || 'Others'].filter(care => care._id !== data._id) } }
      })
      navigation.navigate('Main')
      showToast({ text1: `Task deleted.`, style: 'success' })

    },
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useCheckDoneCare = () => {
  
  return useMutation({
    mutationFn: ({ careId, trackerId, index }: TrackerFormData) => careService.checkDone(careId, trackerId, index),
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUncheckDoneCare = () => {
  
  return useMutation({
    mutationFn: ({careId, trackerId, index}: TrackerFormData) => careService.uncheckDone(careId, trackerId, index),
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useCheckAllDoneCare = () => {
  
  return useMutation({
    mutationFn: ({ careId, trackerId, index }: TrackerFormData) => careService.checkAllDone(careId, trackerId, index),
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUncheckAllDoneCare = () => {
  
  return useMutation({
    mutationFn: ({careId, trackerId, index}: TrackerFormData) => careService.uncheckAllDone(careId, trackerId, index),
    onError: (error) => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}