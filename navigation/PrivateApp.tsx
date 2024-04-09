//npm
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackHeaderProps, NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import { Image, Text, StyleSheet } from "react-native"
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
import SettingsScreen from "@profile/screens/SettingsScreen"
//styles
import { Colors, Forms, Typography } from "@styles/index"
import EditHealthScreen from "@health/screens/EditHealthScreen"
import HealthDetailsScreen from "@health/screens/HealthDetails"
import { getNavigationIconSource } from "@utils/ui"
import NewStatScreen from "features/stat/NewStatScreen"

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
                  <HealthStack.Screen name='Create' component={NewHealthScreen} options={{ title: 'New Health Card'}} />
                  <HealthStack.Screen name='Edit' component={EditHealthScreen} options={{ title: 'Update Health Card'}}/>
                  <HealthStack.Screen name='Details' component={HealthDetailsScreen} options={{ title: 'Health Details' }} />
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
            <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: `${route.params.pet.name ?? 'Edit'}` })} />
            <PetStack.Screen name='Details' options={{ headerShown: false }}>
              {() => (
                <DetailStack.Navigator screenOptions={{ ...stackOptions }}>
                  <DetailStack.Screen name='Index' component={PetDetailsScreen} options={{ title: 'Details' }} />
                  <DetailStack.Screen name='Create' component={NewStatScreen} options={{ title: 'New Log' }} />
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
          <ProfileStack.Navigator screenOptions={{ 
            ...stackOptions
          }}>
            <ProfileStack.Screen name='Profile' component={ProfileScreen} options={{ title: 'Profile', headerShown: false }} />
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
  headerStyle: { backgroundColor: Colors.pink.light },
  headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
  headerTintColor: Colors.pink.dark,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest }
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