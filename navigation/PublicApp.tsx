import { createNativeStackNavigator } from "@react-navigation/native-stack"
//screens
import LoginScreen from "@auth/screens/LoginScreen"
import RegisterScreen from "@auth/screens/RegisterScreen"
import HomeScreen from "@home/HomeScreen"
//style
import { Colors } from "@styles/index"
import { dynamicStackOptions } from "./NavigationStyles"
import { DefaultParamList } from "./types"


const PublicApp = () => {
  const Stack = createNativeStackNavigator<DefaultParamList>()

  return (
    <Stack.Navigator screenOptions={{ ...dynamicStackOptions('modal', true, false), contentStyle: { backgroundColor: Colors.white} }}>
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default PublicApp