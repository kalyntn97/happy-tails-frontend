import { useQuery } from "@tanstack/react-query"
import * as careService from "./careService"

export const careKeyFactory = {
  cares: ['all-cares']
}

export const useGetAllCares = () => {
  return useQuery({
    queryKey: [...careKeyFactory.cares],
    queryFn: careService.getAllCares
  })
}