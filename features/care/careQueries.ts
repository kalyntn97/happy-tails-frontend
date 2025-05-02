import { showDeleteConfirmation } from "@hooks/sharedHooks"
import { ProfileData } from "@profile/ProfileInterface"
import { profileKeyFactory } from "@profile/profileQueries"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { showToast } from "@utils/misc"
import { produce } from "immer"
import { Care, CareFormData, Log, LogFormData, TrackerFormData } from "./CareInterface"
import * as careService from "./careService"

export const careKeyFactory = {
  cares: ['all-cares'],
  careById: (id: string) => [...careKeyFactory.cares, id],
}

export const useGetAllCares = () => {
  const queryClient = useQueryClient()
  const caresCache = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile()).cares

  return useQuery({
    queryKey: [...careKeyFactory.cares],
    queryFn: careService.getAllCares,
    enabled: !caresCache,
  })
}

export const useGetCareById = (careId: string, initialCare?: Care) => {
  const queryClient = useQueryClient()
  const careCache = queryClient.getQueryData(careKeyFactory.careById(initialCare._id))

  return useQuery({
    queryKey: [...careKeyFactory.careById(careId)],
    queryFn: () => careService.getCare(careId),
    initialData: initialCare,
    enabled: !careCache,
  })
}

export const useAddCare = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: CareFormData) => careService.create(formData),
    onSuccess: (data: Care) => {
      queryClient.setQueryData(profileKeyFactory.profile(), (oldData: ProfileData) => {
        return { ...oldData, cares: [...oldData.cares, data] }
      })
      navigation.navigate('Home', { screen: 'Feed' })
      showToast({ text1: `Task added.`, style: 'success' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUpdateCare = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: CareFormData) => careService.update(formData),
    onSuccess: (data: Care) => {
      queryClient.setQueryData(profileKeyFactory.profile(), (oldData: ProfileData) => {
        return { ...oldData, cares: oldData.cares.map(care => care._id === data._id ? data : care) }
      })      
      navigation.navigate('Home', { screen: 'Feed' })
      showToast({ text1: `Task updated.`, style: 'success' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeleteCare = (navigation: any) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (careId: string) => careService.deleteCare(careId),
    onSuccess: (data: string) => {
      queryClient.setQueryData(profileKeyFactory.profile(), (oldData: ProfileData) => {
        return { ...oldData, cares: oldData.cares.filter(care => care._id !== data) }
      })
      navigation.navigate('Home', { screen: 'Feed' })
      showToast({ text1: `Task deleted.`, style: 'success' })

    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useCreateLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: LogFormData) => careService.createLog(formData),
    onSuccess: (data: Log) => {
      queryClient.setQueryData(profileKeyFactory.profile(), (oldData: ProfileData) => 
        produce(oldData, draft => {
          const care = draft.cares.find(care => care._id === data.care)
          if (care) care.logs.push(data)
          else showToast({ text1: 'An error occurred.', style: 'error' })
        })
      )      
      showToast({ text1: `Task updated.`, style: 'success' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useUpdateLog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: LogFormData) => careService.updateLog(formData),
    onSuccess: (data: Log) => {
      queryClient.setQueryData(profileKeyFactory.profile(), (oldData: ProfileData) => 
        produce(oldData, draft => {
          const care = draft.cares.find(care => care._id === data.care)
          if (care) care.logs = care.logs.map(log => log._id === data._id ? data : log)
          else showToast({ text1: 'An error occurred.', style: 'error' })
        })
      )      
      // showToast({ text1: `Updated successfully.`, style: 'success' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useDeleteLog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ logId, careId }: { logId: string, careId: string }) => careService.deleteLog(logId, careId),
    onSuccess: (data: Log) => {
      queryClient.setQueryData(profileKeyFactory.profile(), (oldData: ProfileData) => 
        produce(oldData, draft => {
          const care = draft.cares.find(care => care._id === data.care)
          if (care) care.logs = care.logs.filter(log => log._id !== data._id)
          else showToast({ text1: 'An error occurred.', style: 'error' })
        })
      )      
      // showToast({ text1: `Updated successfully.`, style: 'success' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
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