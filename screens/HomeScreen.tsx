//npm modules
import { View, Text, Pressable } from "react-native"
import {createNativeStackNavigator} from '@react-navigation/native-stack'

const HomeScreen: React.FC = ({ navigation }) => {
  // const HomeStack = createNativeStackNavigator()

  return ( 
    // <HomeStack.Navigator>
    //   <HomeStack.Screen name='' component={} options={{ tabBarLabel: '' }}/>
    //   <HomeStack.Screen name='' component={} options={{ tabBarLabel: '' }}/>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text>Sign in here</Text>
      </Pressable>
    // </HomeStack.Navigator>
  )
}
 
export default HomeScreen