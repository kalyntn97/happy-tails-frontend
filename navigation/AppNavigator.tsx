//npm modules
import { NavigationContainer } from '@react-navigation/native'
import { Image, Text, View } from 'react-native'
import Toast, { BaseToastProps, ToastConfigParams } from 'react-native-toast-message'
//context
import { useAuth } from '@auth/AuthContext'
//components
import PrivateApp from './PrivateApp'
import PublicApp from './PublicApp'
import { CatToast } from '@components/UIComponents'

export const toastConfig = {
  catToast: ({ text1, text2, props }: ToastConfigParams<any>) => ( <CatToast text1={text1} text2={text2} props={props} /> )
}

const AppNavigator: React.FC = () => {
  const { authState } = useAuth()

  return (
    <>
      <NavigationContainer>
        {authState.authenticated ? 
          <PrivateApp />
        : 
          <PublicApp />
        }
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  )
}

export default AppNavigator