//npm modules
import { useEffect } from 'react'
import { Image, Pressable, Text, View, TouchableOpacity, StyleSheet, ImageStyle } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
//context
import { useAuth } from '../context/AuthContext'
import { useProfileContext } from '../context/ProfileContext'
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
import AccountScreen from '../screens/AccountScreen'
import CareIndexScreen from '../screens/CareIndexScreen'
import NewCareScreen from '../screens/NewCareScreen'
import CareDetailsScreen from '../screens/CareDetailsScreen'
import EditCareScreen from '../screens/EditCareScreen'
import HealthIndexScreen from '../screens/HealthIndexScreen'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
import { header } from '../styles/typography'

const Layout: React.FC = () => {
  const { authState, onLogout } = useAuth()
  const { profile } = useProfileContext()
  //tabs
  const Tab = createBottomTabNavigator()
  //stacks
  const PetStack = createNativeStackNavigator()
  const LoginStack = createNativeStackNavigator()
  const SettingsStack = createNativeStackNavigator()
  const CareStack = createNativeStackNavigator()
  const HealthStack = createNativeStackNavigator()
  //drawers
  const AccountDrawer = createDrawerNavigator()
  const HomeDrawer = createDrawerNavigator()

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
            } else if (route.name === 'Pets') {
              icon = focused ? require('../assets/icons/pets-active.png') : require('../assets/icons/pets-inactive.png')
            } else if (route.name === 'Account') {
              icon = focused ? require('../assets/icons/profile-active.png') : require('../assets/icons/profile-inactive.png')
            } else if (route.name === 'User') {
              icon = focused ? require('../assets/icons/login-active.png') : require('../assets/icons/login-inactive.png')
            }

            return <Image source={icon} style={styles.icon as ImageStyle} />
          },
          tabBarStyle: { padding : 10, height: 100, backgroundColor: Colors.lightestPink},
          headerStyle: {
            backgroundColor: Colors.pink,
          },
          headerTintColor: Colors.lightestPink,
          headerTitleStyle: {
            fontSize: 20
          }
        })}
      >
        {authState.authenticated ? (
          <Tab.Group>
            <Tab.Screen name='Home' 
              options={{ title: 'Welcome', /* unmountOnBlur: true */ }}
              // listeners={ ({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) }) }
            >
              {() => (
                <HomeDrawer.Navigator
                  screenOptions={({ route }) =>({
                    drawerType: 'front',
                    // drawerIcon: (),
                    drawerLabelStyle: styles.focusedText,
                    drawerActiveTintColor: Colors.darkPink,
                    drawerActiveBackgroundColor: Colors.lightPink,
                    drawerStyle: { backgroundColor: Colors.lightestPink, width: '50%' },
                    header: ({ navigation }) => {
                      return (
                        <View style={styles.header}>
                          <Pressable style={[styles.menuBtn, { left: 10 }]} onPress={() => navigation.openDrawer()}>
                            <Image source={require('../assets/icons/menu.png')} style={styles.smallIcon as ImageStyle} />
                          </Pressable>
                        </View>
                      )
                    }
                  })}
                >
                  <HomeDrawer.Screen name='Welcome' component={HomeScreen} options={{ title: 'Welcome'}}/>
                  <HomeDrawer.Screen name='Care' options={{ title: 'Pet Care' }}>
                    {() => (
                      <CareStack.Navigator screenOptions={{ headerShown: false }}>
                        <CareStack.Screen name='Index' component={CareIndexScreen} options={{ title: 'All Pet Care' }}/>
                        <CareStack.Screen name='Create' component={NewCareScreen} options={{ title: 'Add Tracker' }}/>
                        <CareStack.Screen name='Details' component={CareDetailsScreen} options={{ title: 'Care Details' }}/>
                        <CareStack.Screen name='Edit' component={EditCareScreen} options={{ title: 'Edit Pet Care' }}/>
                    </CareStack.Navigator>
                    )}
                  </HomeDrawer.Screen>
                  <HomeDrawer.Screen name='Health' options={{ title: 'Pet Health' }}>
                    {() => (
                      <HealthStack.Navigator>
                        <HealthStack.Screen name='Index' component={HealthIndexScreen} options={{ title: 'All Health Care' }}/>
                      </HealthStack.Navigator>
                    )}
                  </HomeDrawer.Screen>
                </HomeDrawer.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name='Pets' 
              options={{ title: 'All Pets', unmountOnBlur: true }}
              listeners={ ({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) }) }

            >
              {() => (
                <PetStack.Navigator>
                  <PetStack.Screen name='Index' component={PetIndexScreen} options={{ title: 'All Pets', headerShown: false }}/>
                  <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}/>
                  <PetStack.Screen name='Details' component={PetDetailsScreen} options={{ title: 'Details' }} />
                  <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: `${route.params.pet.name ?? 'Edit'}` })}/>
                </PetStack.Navigator>
              )}
            </Tab.Screen>
            <Tab.Screen name='Account' 
              options={{ title: 'Profile', unmountOnBlur: true }}
              listeners={ ({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) }) }
            >
              {() => (
                <AccountDrawer.Navigator
                  initialRouteName='My Profile'
                  drawerContent={(props) => {
                    return (
                      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
                        <DrawerItemList {...props} />
                        {/* <DrawerItem
                          label={() => 
                            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                              <Text style={styles.btnText}>Logout</Text>
                            </TouchableOpacity>
                          }
                          onPress={logout}
                          style={{ marginTop: 'auto', width: '100%'}}
                        /> */}
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
                    drawerStyle: { backgroundColor: Colors.lightestPink, width: '50%', height: '50%' },
                    header: ({ navigation }) => {
                      return (
                        <View style={styles.header}>
                          <Text style={styles.headerText}>{profile.name}</Text>
                          <Pressable style={[styles.menuBtn, { right: 10 }]} onPress={() => navigation.openDrawer()}>
                            <Image source={require('../assets/icons/menu.png')} style={styles.smallIcon as ImageStyle} />
                          </Pressable>
                        </View>
                      )
                    }
                  })}
                >
                  <AccountDrawer.Screen name='Settings' options={{ title: 'Profile' }}>
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
                  </AccountDrawer.Screen>

                  <AccountDrawer.Screen name='Config' component={AccountScreen} options={{ title: 'Manage Account' }}
                  />
                  
                </AccountDrawer.Navigator>
              )}
            </Tab.Screen>
          </Tab.Group>
        ) : (
          <Tab.Group>
            <Tab.Screen name='Home' component={HomeScreen} options={{title: 'Welcome', tabBarStyle: { display: 'none' }, headerShown: false }} />
            <Tab.Screen name='User' options={{ title: 'Account' }}>
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
  header: {
    width: '100%',
    ...Spacing.flexRow
  },
  headerText: {
    ...Typography.xSmallHeader,
    margin: 10
  },
  menuBtn: {
    position: 'absolute',
    top: 5
  },
  scrollView: {
    ...Spacing.fullWH,
  },
  // logoutBtn: {
  //   ...Buttons.xSmallSquare,
  //   backgroundColor: Colors.darkPink,
  //   width: '90%'
  // },
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