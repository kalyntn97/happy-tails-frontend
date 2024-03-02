import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import * as profileService from "./profileService"
import { Profile, ProfileFormData } from "./ProfileInterface"

export const profileKeyFactory = {
  profile: ['profile'],
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: [...profileKeyFactory.profile],
    queryFn: profileService.getProfile,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, bio, photoData }: ProfileFormData) => profileService.update(name, bio, photoData),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [...profileKeyFactory.profile] })
    }
  })
}