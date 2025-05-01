import { TabScreenNavigationProp } from "@navigation/types"
import { useActiveDate } from "@store/store"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { showToast } from "@utils/misc"
import { PhotoFormData, Profile, ProfileData, ProfileMutationFormData } from "./ProfileInterface"
import * as profileService from "./profileService"

export const profileKeyFactory = {
  profile: (year?: number) => ['profile', year],
}

export const useGetProfile = (year?: number) => {
  const { year: activeYear } = useActiveDate()
  const inputYear = year ?? activeYear
  
  return useQuery({
    queryKey: [...profileKeyFactory.profile(inputYear)],
    queryFn: () => profileService.getProfile(inputYear),
  })
}

export const useUpdateProfile = (navigation: TabScreenNavigationProp<'Profile'>) => {
  const queryClient = useQueryClient()
  const { year } = useActiveDate()

  return useMutation({
    mutationFn: ({ formData, photoData }: ProfileMutationFormData) => profileService.update(formData, photoData),
    onSuccess: (data: Profile) => {
      queryClient.setQueryData(profileKeyFactory.profile(year), (oldData: ProfileData) => {
        return {...oldData, profile: data }
      })
      showToast({ text1: 'Profile updated.', style: 'success' })
      navigation.navigate('Home', { screen: 'Profile' })
    },
    onError: () => showToast({ text1: 'An error occurred.', style: 'error' })
  })
}

export const useAddBanner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoData: PhotoFormData) => profileService.addBanner(photoData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...profileKeyFactory.profile()] })
    }
  })
}

// export const useUpdateStreak = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: () => profileService.updateStreak(),
//     onSuccess: () => {
//       return queryClient.invalidateQueries({ queryKey: [...profileKeyFactory.profile] })
//     }
//   })
// }