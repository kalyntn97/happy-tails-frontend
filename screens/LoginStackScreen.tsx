//npm modules
import {createNativeStackNavigator} from '@react-navigation/native-stack'
//components
import LoginScreen from '../components/LoginScreen'
import RegisterScreen from '../components/RegisterScreen'

const LoginStackScreen = () => {
  const LoginStack = createNativeStackNavigator()
  
  return ( 
    <LoginStack.Navigator>
      <LoginStack.Screen name='Login' component={LoginScreen} />
      <LoginStack.Screen name='Register' component={RegisterScreen} />
    </LoginStack.Navigator>
  )
}
 
export default LoginStackScreen