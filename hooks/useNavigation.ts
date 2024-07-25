import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect } from "react"

const useCustomNavigation = () => {
  const navigation = useNavigation()

  const navigateTo = (screenName: any, params: any) => {
    navigation.navigate(screenName, params)
  }

  const goBack = () => {
    navigation.goBack()
  }

  return {
    navigateTo, goBack
  }
}

export default useCustomNavigation