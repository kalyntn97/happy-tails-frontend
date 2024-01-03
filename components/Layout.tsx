//npm modules
import { Image, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
//context
import { useAuth } from '../context/AuthContext'
//screens
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import EditProfileScreen from '../screens/EditProfileScreen'
import PetIndexScreen from '../screens/PetIndexScreen'
import NewPetScreen from '../screens/NewPetScreen'
import EditPetScreen from '../screens/EditPetScreen'
import PetDetailsScreen from '../screens/PetDetailsScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
//styles
import { Colors } from '../styles'

const Layout: React.FC = () => {
  const { authState } = useAuth()
  const Tab = createBottomTabNavigator()
  const PetStack = createNativeStackNavigator()
  const LoginStack = createNativeStackNavigator()
  const SettingsStack = createNativeStackNavigator()

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
            } else if (route.name === 'Profile') {
              icon = focused ? require('../assets/icons/pets-active.png') : require('../assets/icons/pets-inactive.png')
            } else if (route.name === 'Settings') {
              icon = focused ? require('../assets/icons/settings-active.png') : require('../assets/icons/settings-inactive.png')
            } else if (route.name === 'Account') {
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
          <Tab.Group>
            <Tab.Screen name='Home' component={HomeScreen} options={{title: 'Welcome'}}/>
            <Tab.Screen name='Profile' options={{title: 'Profile'}}>
              {() => (
                <PetStack.Navigator>
                  <PetStack.Screen name='Pets' component={PetIndexScreen} options={{ title: 'All Pets' }}/>
                  <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}/>
                  <PetStack.Screen name='Details' component={PetDetailsScreen} options={{ title: 'Pet Details' }}/>
                  <PetStack.Screen name='Edit' component={EditPetScreen} options={{ title: 'Edit a Pet' }}/>
                </PetStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name='Settings' options={{title: 'Settings'}}>
              {() => (
                <SettingsStack.Navigator>
                  <SettingsStack.Screen name='Account' component={SettingsScreen} options={{ title: 'Profile', headerShown: false}} />
                  <SettingsStack.Screen name='Edit' component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
                </SettingsStack.Navigator>
              )}
            </Tab.Screen>
          </Tab.Group>
        ) : (
          <Tab.Group>
            <Tab.Screen name='Home' component={HomeScreen} options={{title: 'Welcome'}}/>
            <Tab.Screen name='Account' options={{ title: 'Account' }}>
              {() => (
                <LoginStack.Navigator>
                  <LoginStack.Screen name='Login' component={LoginScreen} options={{ title: 'Sign in', headerShown: false }}/>
                  <LoginStack.Screen name='Register' component={RegisterScreen} options={{ title: 'Register' }}/>
              </LoginStack.Navigator>
              )}
            </Tab.Screen>
          </Tab.Group>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Layout