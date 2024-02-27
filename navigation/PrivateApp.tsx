//npm
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Image, Text, StyleSheet } from "react-native"
//screens
import CareDetailsScreen from "@screens/CareScreens/CareDetailsScreen"
import CareIndexScreen from "@screens/CareScreens/CareIndexScreen"
import EditCareScreen from "@screens/CareScreens/EditCareScreen"
import NewCareScreen from "@screens/CareScreens/NewCareScreen"
import HealthIndexScreen from "@screens/HealthScreens/HealthIndexScreen"
import NewHealthScreen from "@screens/HealthScreens/NewHealthScreen"
import HomeScreen from "@screens/HomeScreen"
import EditPetScreen from "@screens/PetScreens/EditPetScreen"
import NewPetScreen from "@screens/PetScreens/NewPetScreen"
import PetDetailsScreen from "@screens/PetScreens/PetDetailsScreen"
import PetIndexScreen from "@screens/PetScreens/PetIndexScreen"
import AccountScreen from "@screens/ProfileScreens/AccountScreen"
import EditProfileScreen from "@screens/ProfileScreens/EditProfileScreen"
import SettingsScreen from "@screens/ProfileScreens/SettingsScreen"
//styles
import { Colors, Forms } from "@styles/index"

const PrivateApp = () => {
  const Tab = createBottomTabNavigator()
  //HomeTab
  const HomeStack = createNativeStackNavigator()
  const CareStack = createNativeStackNavigator()
  const HealthStack = createNativeStackNavigator()
  //PetTab
  const PetStack = createNativeStackNavigator()
  //AccountTab
  const ProfileStack = createNativeStackNavigator()
  const SettingsStack = createNativeStackNavigator()
  
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => {
          let name: string
          switch (route.name) {
            case 'Home': name = 'Home'; break
            case 'Pets': name = 'Pets'; break
            case 'Account': name = 'Profile'; break
            case 'User': name = 'Account'; break
            default: name = 'Home'
          }
          return <Text style={[styles.iconLabel, { color: focused ? Colors.darkPink : 'black'}]}>{name}</Text>
        },
        tabBarIcon: ({ focused }) => {
          let icon:any

          if (route.name === 'Home') {
            icon = focused ? require('@assets/icons/home-active.png') : require('@assets/icons/home-inactive.png')
          } else if (route.name === 'Pets') {
            icon = focused ? require('@assets/icons/pets-active.png') : require('@assets/icons/pets-inactive.png')
          } else if (route.name === 'Account') {
            icon = focused ? require('@assets/icons/profile-active.png') : require('@assets/icons/profile-inactive.png')
          } else if (route.name === 'User') {
            icon = focused ? require('@assets/icons/login-active.png') : require('@assets/icons/login-inactive.png')
          }

          return <Image source={icon} style={styles.icon } />
        },
        tabBarStyle: { padding : 10, height: 100, backgroundColor: Colors.white},
        headerStyle: {
          backgroundColor: Colors.lightPink,
        },
        headerTintColor: Colors.darkPink,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name='Home'
        options={({ route }) => ({ headerShown: false })}>
        {() => (
          <HomeStack.Navigator
            screenOptions={() => ({
              headerStyle: {
                backgroundColor: Colors.lightPink,
              },
              headerTintColor: Colors.darkPink,
              headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
              },
              headerTitle: ''
            })}
          >
            <HomeStack.Screen name='Main' component={HomeScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name='Care'>
              {() => (
                <CareStack.Navigator screenOptions={{ 
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.lightestPink }
                }}>
                  <CareStack.Screen name='Index' component={CareIndexScreen} options={{ title: 'All Pet Care' }}/>
                  <CareStack.Screen name='Create' component={NewCareScreen} options={{ title: 'Add Tracker' }}/>
                  <CareStack.Screen name='Details' component={CareDetailsScreen} options={{ title: 'Care Details' }}/>
                  <CareStack.Screen name='Edit' component={EditCareScreen} options={{ title: 'Edit Pet Care' }}/>
                </CareStack.Navigator>
              )}
            </HomeStack.Screen>
        
            <HomeStack.Screen name='Health'>
              {() => (
                <HealthStack.Navigator screenOptions={{ 
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.lightestPink }
                }}>
                  <HealthStack.Screen name='Index' component={HealthIndexScreen} options={{ title: 'All Pet Health'}} />
                  <HealthStack.Screen name='Create' component={NewHealthScreen} options={{ title: 'New Pet Card'}} />
                </HealthStack.Navigator>
              )}
            </HomeStack.Screen>
        
          </HomeStack.Navigator> 
        )}
      </Tab.Screen>

      <Tab.Screen name='Pets'
        options={{ title: 'All Pets' }}>
        {() => (
          <PetStack.Navigator
          screenOptions={{ contentStyle: { backgroundColor: Colors.lightestPink }}}
          >
            <PetStack.Screen name='Index' component={PetIndexScreen} options={{ title: 'All Pets', headerShown: false }}/>
            <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}
            />
            <PetStack.Screen name='Details' component={PetDetailsScreen} options={{ title: 'Details' }} />
            <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: `${route.params.pet.name ?? 'Edit'}` })}/>
          </PetStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen name='Account'
        options={{ title: 'Profile', unmountOnBlur: true }}
        listeners={ ({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) }) }>
        {() => (
          <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name='Settings' options={{ title: 'Profile' }}>
              {() => (
                <SettingsStack.Navigator screenOptions={{ contentStyle: { backgroundColor: Colors.lightestPink }}}
                >
                  <SettingsStack.Screen name='Profile' component={SettingsScreen} options={{ title: 'Profile', headerShown: false }} />
                  <SettingsStack.Screen name='Edit' component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
                </SettingsStack.Navigator>
              )}
            </ProfileStack.Screen>
      
            <ProfileStack.Screen name='Config' component={AccountScreen} options={{ title: 'Manage Account' }} />
          </ProfileStack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  icon: {
    ...Forms.icon
  },
  iconLabel: {
    fontWeight: 'bold'
  },
})

export default PrivateApp