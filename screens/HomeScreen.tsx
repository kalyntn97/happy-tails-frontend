//npm modules
import { View, Text, Pressable } from "react-native"
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { useAuth } from "../context/AuthContext"

const HomeScreen: React.FC = ({ navigation }) => {
  // const HomeStack = createNativeStackNavigator()
  const { authState } = useAuth()

  return ( 
    // <HomeStack.Navigator>
    //   <HomeStack.Screen name='' component={} options={{ tabBarLabel: '' }}/>
    //   <HomeStack.Screen name='' component={} options={{ tabBarLabel: '' }}/>
    <>
      {authState?.authenticated ? (
        <View>
          
        </View>
      ) : (
        <View>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text>Sign in</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text>Register</Text>
          </Pressable>
        </View>
      )}
    </>
    // </HomeStack.Navigator>
  )
}
 
export default HomeScreen