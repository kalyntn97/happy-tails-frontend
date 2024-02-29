import { useQuery } from "@tanstack/react-query"
import * as profileService from "./profileService"
import { Profile } from "./ProfileInterface"

export const profileKeyFactory = {
  profile: ['profile'],
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: [...profileKeyFactory.profile],
    queryFn: profileService.getProfile,
  })
}