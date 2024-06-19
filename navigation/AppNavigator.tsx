//npm modules
import { NavigationContainer } from '@react-navigation/native'
import { Image, Text, View } from 'react-native'
import Toast, { BaseToastProps, ToastConfigParams } from 'react-native-toast-message'
//context
import { useAuth } from '@auth/AuthContext'
//components
import PrivateApp from './PrivateApp'
import PublicApp from './PublicApp'
import { toastConfig } from '@components/UIComponents'

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