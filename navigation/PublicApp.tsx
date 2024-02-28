import { createNativeStackNavigator } from "@react-navigation/native-stack"
//screens
import LoginScreen from "@auth/screens/LoginScreen"
import RegisterScreen from "@auth/screens/RegisterScreen"
import HomeScreen from "@features/home/HomeScreen"
//style
import { Colors } from "@styles/index"


const PublicApp = () => {
  const Stack = createNativeStackNavigator()
  const LoginStack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{
      contentStyle: { backgroundColor: Colors.white},
      headerShown: false,
    }}>
      <Stack.Screen name='Home' component={HomeScreen} options={{title: 'Welcome' }} />
      <Stack.Screen name='User' options={{ title: 'Account' }}>
        {() => (
          <LoginStack.Navigator
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: Colors.lightestPink }
            }}
          >
            <LoginStack.Screen name='Login' component={LoginScreen} options={{ title: 'Sign in' }}/>
            <LoginStack.Screen name='Register' component={RegisterScreen} options={{ title: 'Register' }}/>
          </LoginStack.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default PublicApp