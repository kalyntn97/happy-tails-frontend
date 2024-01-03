//npm modules
import { Image, Pressable, Text, View, TouchableOpacity, StyleSheet, ImageStyle } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
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
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const Layout: React.FC = () => {
  const { authState, onLogout } = useAuth()
  const Tab = createBottomTabNavigator()

  const PetStack = createNativeStackNavigator()
  const LoginStack = createNativeStackNavigator()
  const SettingsStack = createNativeStackNavigator()
  
  const Drawer = createDrawerNavigator()

  const logout = async () => {
    const result = await onLogout!()
    if (result && result.error) {
      alert(result.status)
    }
  }

  return ( 
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            let icon:any

            if (route.name === 'Home') {
              icon = focused ? require('../assets/icons/home-active.png') : require('../assets/icons/home-inactive.png')
            } else if (route.name === 'Profile') {
              icon = focused ? require('../assets/icons/pets-active.png') : require('../assets/icons/pets-inactive.png')
            } else if (route.name === 'Settings') {
              icon = focused ? require('../assets/icons/profile-active.png') : require('../assets/icons/profile-inactive.png')
            } else if (route.name === 'Account') {
              icon = focused ? require('../assets/icons/login-active.png') : require('../assets/icons/login-inactive.png')
            }

            return <Image source={icon} style={styles.icon as ImageStyle} />
          },
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
            <Tab.Screen name='Profile' options={{title: 'All Pets'}}>
              {() => (
                <PetStack.Navigator>
                  <PetStack.Screen name='Pets' component={PetIndexScreen} options={{ title: 'All Pets', headerShown: false }}/>
                  <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}/>
                  <PetStack.Screen name='Details' component={PetDetailsScreen} options={{ title: 'Details' }} />
                  <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: `${route.params.pet.name ?? 'Edit'}` })}/>
                </PetStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name='Settings' options={{title: 'Profile'}}>
              {() => (
                <Drawer.Navigator
                  initialRouteName='My Profile'
                  drawerContent={(props) => {
                    return (
                      <DrawerContentScrollView {...props} contentContainerStyle={{ height: '100%' }}>
                        <DrawerItemList {...props} />
                        <DrawerItem
                          label={() => 
                            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                              <Text style={styles.btnText}>Logout</Text>
                            </TouchableOpacity>
                          }
                          onPress={logout}
                          style={{ marginTop: 'auto' }}
                
                        />
                      </DrawerContentScrollView>
                    )
                  }}
                  screenOptions={({ route }) =>({
                    drawerType: 'front',
                    drawerPosition: 'right',
                    // drawerIcon: (),
                    drawerLabelStyle: styles.focusedText,
                    drawerActiveTintColor: Colors.darkPink,
                    drawerActiveBackgroundColor: Colors.lightPink,
                    drawerStyle: { backgroundColor: Colors.lightestPink, width: '40%', height: '50%' },
                    header: ({ navigation }) => {
                      return (
                        <Pressable style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
                          <Image source={require('../assets/icons/menu.png')} style={styles.smallIcon as ImageStyle} />
                        </Pressable>
                      )
                    }
                  })}
                >
                  <Drawer.Screen name='Account' options={{ title: 'My Profile' }}>
                    {() => (
                      <SettingsStack.Navigator>
                        <SettingsStack.Screen
                          name='Profile'
                          component={SettingsScreen}
                          options={{ title: 'Profile', headerShown: false }}
                        />
                        <SettingsStack.Screen
                          name='Edit'
                          component={EditProfileScreen}
                          options={{ title: 'Edit Profile' }}
                        />
                      </SettingsStack.Navigator>
                    )}
                  </Drawer.Screen>
                </Drawer.Navigator>
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

const styles = StyleSheet.create({
  focusedText: {
    color: Colors.darkPink,
    fontSize: 14, 
    fontWeight: 'bold'
  },
  menuBtn: {
    position: 'absolute', 
    right: 10, 
    top: 5
  },
  logoutBtn: {
    ...Buttons.xSmallSquare,
    backgroundColor: Colors.darkPink,
  },
  btnText: {
    ...Buttons.buttonText,
    color: Colors.lightestPink
  },
  icon: {
    ...Forms.icon
  },
  smallIcon: {
    ...Forms.smallIcon
  }
})

export default Layout