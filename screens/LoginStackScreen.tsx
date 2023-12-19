//npm modules
import {createNativeStackNavigator} from '@react-navigation/native-stack'
//components
import LoginScreen from '../components/LoginScreen'
import RegisterScreen from '../components/RegisterScreen'

const LoginStackScreen = () => {
  const LoginStack = createNativeStackNavigator()
  
  return ( 
    <LoginStack.Navigator>
      <LoginStack.Screen name='Login' component={LoginScreen} options={{ title: 'Sign in' }}/>
      <LoginStack.Screen name='Register' component={RegisterScreen} options={{ title: 'Register' }}/>
    </LoginStack.Navigator>
  )
}
 
export default LoginStackScreen