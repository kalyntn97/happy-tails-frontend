//npm modules
import { Image, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
//context
import { useAuth } from '../context/AuthContext'
//screens
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import LoginScreen from '../screens/LoginScreen'
import PetsScreen from '../screens/PetsScreen'
//styles
import { Colors } from '../styles'

const Layout: React.FC = () => {
  const Tab = createBottomTabNavigator()
  const { authState } = useAuth()
  return ( 
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? Colors.darkPink : 'gray', fontSize: 14, fontWeight: 'bold' }}>
              {route.name}
            </Text>
          ),
          tabBarIcon: ({ focused }) => {
            let icon:any

            if (route.name === 'Home') {
              icon = focused ? require('../assets/icons/home-active.png') : require('../assets/icons/home-inactive.png')
            } else if (route.name === 'Pets') {
              icon = focused ? require('../assets/icons/pets-active.png') : require('../assets/icons/pets-inactive.png')
            } else if (route.name === 'Settings') {
              icon = focused ? require('../assets/icons/settings-active.png') : require('../assets/icons/settings-inactive.png')
            } else if (route.name === 'Login') {
              icon = focused ? require('../assets/icons/login-active.png') : require('../assets/icons/login-inactive.png')
            }

            return <Image source={icon} style={{ width: 40, height: 40 }} />
          },
          tabBarActiveTintColor: Colors.darkestPink,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { padding : 10, height: 100 },
          headerStyle: {
            backgroundColor: Colors.pink,
          },
          headerTintColor: Colors.lightestPink,
          headerTitleStyle: {
            fontSize: 20
          }
        })}
      >
        {authState?.authenticated ? (
          <>
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Pets' component={PetsScreen} />
            <Tab.Screen name='Settings' component={SettingsScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Login' component={LoginScreen} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Layout