//npm
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Image, Text } from "react-native"
//screens
import CareDetailsScreen from "@care/screens/CareDetailsScreen"
import CareIndexScreen from "@care/screens/CareIndexScreen"
import EditCareScreen from "@care/screens/EditCareScreen"
import NewCareScreen from "@care/screens/NewCareScreen"
import HealthIndexScreen from "@health/screens/HealthIndexScreen"
import NewHealthScreen from "@health/screens/NewHealthScreen"
import HomeScreen from "@home/HomeScreen"
import EditPetScreen from "@pet/screens/EditPetScreen"
import NewPetScreen from "@pet/screens/NewPetScreen"
import PetDetailsScreen from "@pet/screens/PetDetailsScreen"
import PetIndexScreen from "@pet/screens/PetIndexScreen"
import EditProfileScreen from "@profile/screens/EditProfileScreen"
import ProfileScreen from "@profile/screens/ProfileScreen"
import EditAccountScreen from "@profile/screens/EditAccountScreen"
import SettingsScreen from "@profile/screens/SettingsScreen"
import EditHealthScreen from "@health/screens/EditHealthScreen"
import HealthDetailsScreen from "@health/screens/HealthDetails"
import NewStatScreen from "@stat/screens/NewStatScreen"
import StatDetails from "@stat/screens/StatDetails"
import MorePetDetailsScreen from "@pet/screens/MorePetDetailsScreen"
import EditMorePetDetailsScreen from "@pet/screens/EditMorePetDetailsScreen"
//helpers
import { getNavigationIconSource } from "@utils/ui"
//styles
import { Typography } from "@styles/index"
import { styles, tabBarOptions, modalPresentation, stackOptions, noTitleHeaderStyle, titleOnlyHeaderStyle  } from "./NavigationStyles"

const PrivateApp = () => {
  const Tab = createBottomTabNavigator()
  //HomeTab
  const HomeStack = createNativeStackNavigator()
  const CareStack = createNativeStackNavigator()
  const HealthStack = createNativeStackNavigator()
  //PetTab
  const PetStack = createNativeStackNavigator()
  const DetailStack = createNativeStackNavigator()
  //AccountTab
  const ProfileStack = createNativeStackNavigator()
  
  return (
    <Tab.Navigator
      initialRouteName='Home'
      backBehavior="history"
      screenOptions={({ route }) => ({
        ...tabBarOptions,
        tabBarLabel: ({ focused }) => {
          let name: string
          switch (route.name) {
            case 'Home': name = 'Home'; break
            case 'Pets': name = 'Pets'; break
            case 'Account': name = 'Account'; break
            case 'User': name = 'Profile'; break
            default: name = 'Home'
          }
          return <Text style={[styles.iconLabel, focused ? {...Typography.focused} : {...Typography.unFocused}]}>{name}</Text>
        },
        tabBarIcon: ({ focused }) => {
          const iconSource = getNavigationIconSource(route.name, focused ? 'active' : 'inactive')
          return <Image source={iconSource} style={styles.icon } />
        },
      })}
    >
      <Tab.Screen name='Home'>
        {() => (
          <HomeStack.Navigator
            initialRouteName="Main"
            screenOptions={() => ({ headerShown: false, ...modalPresentation })}
          >
            <HomeStack.Screen name='Main' component={HomeScreen} />
            <HomeStack.Screen name='Care'>
              {() => (
                <CareStack.Navigator screenOptions={{ ...stackOptions, }}>
                  <CareStack.Screen name='Index' component={CareIndexScreen} options={{ title: 'All Pet Care'}}/>
                  <CareStack.Screen name='Create' component={NewCareScreen} options={{ title: 'Add a Task' }}/>
                  <CareStack.Screen name='Details' component={CareDetailsScreen} options={{...noTitleHeaderStyle }}/>
                  <CareStack.Screen name='Edit' component={EditCareScreen} options={{ title: 'Edit Task' }}/>
                </CareStack.Navigator>
              )}
            </HomeStack.Screen>
        
            <HomeStack.Screen name='Health'>
              {() => (
                <HealthStack.Navigator screenOptions={{ ...stackOptions }}>
                  <HealthStack.Screen name='Index' component={HealthIndexScreen} options={{ title: 'All Pet Health'}} />
                  <HealthStack.Screen name='Create' component={NewHealthScreen} options={{ title: 'Add a Vet Visit'}} />
                  <HealthStack.Screen name='Edit' component={EditHealthScreen} options={{ title: 'Update Vet Visit'}}/>
                  <HealthStack.Screen name='Details' component={HealthDetailsScreen} options={{ ...noTitleHeaderStyle }} />
                </HealthStack.Navigator>
              )}
            </HomeStack.Screen>
        
          </HomeStack.Navigator> 
        )}
      </Tab.Screen>

      <Tab.Screen name='Pets'>
        {() => (
          <PetStack.Navigator
            screenOptions={{ ...stackOptions, ...modalPresentation }}
          >
            <PetStack.Screen name='Index' component={PetIndexScreen} options={{ ...titleOnlyHeaderStyle }} />
            <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}
            />
            <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: 'Edit Pet' })} />
            <PetStack.Screen name='Details' options={{ headerShown: false }}>
              {() => (
                <DetailStack.Navigator screenOptions={{ ...stackOptions }}>
                  <DetailStack.Screen name='Index' component={PetDetailsScreen} options={{ ...noTitleHeaderStyle }} />
                  <DetailStack.Screen name='PetDetails' component={MorePetDetailsScreen} options={{ title: 'More Details' }} />
                  <DetailStack.Screen name='Edit' component={EditMorePetDetailsScreen} options={{ title: 'Edit pet details' }} />
                  <DetailStack.Screen name='Create' component={NewStatScreen} options={{ title: 'New Log' }} />
                  <DetailStack.Screen name='Stat' component={StatDetails} options={{ title: 'Details' }} />
                </DetailStack.Navigator>
              )}
            </PetStack.Screen>
          </PetStack.Navigator>
        )}
      </Tab.Screen>

      <Tab.Screen name='User'
        /* options={{ unmountOnBlur: true, }}
        listeners={ ({ navigation }) => ({ blur: () => navigation.setParams({ screen: undefined }) }) } */>
        {() => (
          <ProfileStack.Navigator screenOptions={{ ...stackOptions, ...modalPresentation }}>
            <ProfileStack.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }} />
            <ProfileStack.Screen name='Edit' component={EditProfileScreen} options={{ title: 'Edit Profile'}} />
            <ProfileStack.Screen name='Settings' component={SettingsScreen} />
            <ProfileStack.Screen name='Account' component={EditAccountScreen} options={{ title: 'Edit Account' }} />
          </ProfileStack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default PrivateApp