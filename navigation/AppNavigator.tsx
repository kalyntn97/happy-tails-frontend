//npm modules
import { NavigationContainer } from '@react-navigation/native'
//context
import { useAuth } from '@auth/AuthContext'
//components
import PrivateApp from './PrivateApp'
import PublicApp from './PublicApp'

const AppNavigator: React.FC = () => {
  const { authState } = useAuth()

  return ( 
    <NavigationContainer>
      {authState.authenticated ? 
        <PrivateApp />
      : 
        <PublicApp />
      }
    </NavigationContainer>
  )
}

export default AppNavigator