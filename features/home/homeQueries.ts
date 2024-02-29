import { useQueries } from "@tanstack/react-query"
//key
import { profileKeyFactory } from "@profile/profileQueries"
import { petKeyFactory } from "@pet/petQueries"
import { careKeyFactory } from "@care/careQueries"
import { healthKeyFactory } from "@health/healthQueries"
//services
import { getProfile } from "@profile/profileService"
import { getAllPets } from "@pet/petService"
import { getAllCares } from "@care/careService"
import { getAllHealths } from "@health/healthService"

export const useUserQueries = () => {
  return useQueries({
    queries: [
      { queryKey: [...profileKeyFactory.profile], queryFn: getProfile},
      { queryKey: [...petKeyFactory.pets], queryFn: getAllPets},
      { queryKey: [...careKeyFactory.cares], queryFn: getAllCares},
      { queryKey: [...healthKeyFactory.healths], queryFn: getAllHealths},
    ]
  })
}