//npm
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps, NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import { Image, Text, StyleSheet, ViewStyle } from "react-native"
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
import EditProfileScreen from "@screens/ProfileScreens/EditProfileScreen"
import ProfileScreen from "@screens/ProfileScreens/ProfileScreen"
import SettingsScreen from "@screens/ProfileScreens/SettingsScreen"
//styles
import { Colors, Forms } from "@styles/index"
import { HeaderWithGoBackButton } from "@components/CustomHeader"
import { GoBackButton } from "@components/ButtonComponent"
import { RouteProp } from "@react-navigation/native"

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
  
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        ...tabBarOptions,
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
      })}
    >
      <Tab.Screen name='Home'>
        {() => (
          <HomeStack.Navigator
            screenOptions={() => ({ headerShown: false })}
          >
            <HomeStack.Screen name='Main' component={HomeScreen} />
            <HomeStack.Screen name='Care'>
              {() => (
                <CareStack.Navigator screenOptions={{ ...stackOptions }}>
                  <CareStack.Screen name='Index' component={CareIndexScreen} options={{ title: 'All Pet Care' }}/>
                  <CareStack.Screen name='Create' component={NewCareScreen} options={{ title: 'Add Tracker' }}/>
                  <CareStack.Screen name='Details' component={CareDetailsScreen} options={{ title: 'Care Details' }}/>
                  <CareStack.Screen name='Edit' component={EditCareScreen} options={{ title: 'Edit Pet Care' }}/>
                </CareStack.Navigator>
              )}
            </HomeStack.Screen>
        
            <HomeStack.Screen name='Health'>
              {() => (
                <HealthStack.Navigator screenOptions={{ ...stackOptions }}>
                  <HealthStack.Screen name='Index' component={HealthIndexScreen} options={{ title: 'All Pet Health'}} />
                  <HealthStack.Screen name='Create' component={NewHealthScreen} options={{ title: 'New Pet Card'}} />
                </HealthStack.Navigator>
              )}
            </HomeStack.Screen>
        
          </HomeStack.Navigator> 
        )}
      </Tab.Screen>

      <Tab.Screen name='Pets'>
        {() => (
          <PetStack.Navigator
          screenOptions={{ ...stackOptions }}
          >
            <PetStack.Screen name='Index' component={PetIndexScreen} options={{ title: 'All Pets' }}/>
            <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}
            />
            <PetStack.Screen name='Details' component={PetDetailsScreen} options={{ title: 'Details' }} />
            <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: `${route.params.pet.name ?? 'Edit'}` })}/>
          </PetStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen name='User'
        options={{ unmountOnBlur: true, }}
        listeners={ ({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) }) }>
        {() => (
          <ProfileStack.Navigator screenOptions={{ 
            // headerBackImageSource: require('@assets/icons/undo.png'),
            ...stackOptions
          }}>
            <ProfileStack.Screen name='Profile' component={ProfileScreen} options={{ title: 'Profile' }} />
            <ProfileStack.Screen name='Edit' component={EditProfileScreen} options={{ title: 'Edit Profile'}} />
            <ProfileStack.Screen name='Settings' component={SettingsScreen} />
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

const headerStyle: any = {
  headerStyle: { backgroundColor: Colors.lightPink },
  headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
  headerTintColor: Colors.darkPink,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.lightestPink }
}

const stackOptions: NativeStackNavigationOptions = {
  ...headerStyle,
  ...contentStyle,
}

const tabBarOptions: BottomTabNavigationOptions = {
  tabBarStyle: { padding : 10, height: 100, backgroundColor: Colors.white},
  headerShown: false,
}

export default PrivateApp