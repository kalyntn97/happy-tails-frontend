import { createNativeStackNavigator } from "@react-navigation/native-stack"
//screens
import LoginScreen from "@auth/screens/LoginScreen"
import RegisterScreen from "@auth/screens/RegisterScreen"
import HomeScreen from "@home/HomeScreen"
//style
import { Colors } from "@styles/index"
import { noTitleHeaderModalStyle, modalPresentation } from "./NavigationStyles"


const PublicApp = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{
      ...modalPresentation,
      contentStyle: { backgroundColor: Colors.white},
    }}>
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={LoginScreen} options={{ ...noTitleHeaderModalStyle }} />
      <Stack.Screen name='Register' component={RegisterScreen} options={{ ...noTitleHeaderModalStyle }} />
      
    </Stack.Navigator>
  )
}

export default PublicApp