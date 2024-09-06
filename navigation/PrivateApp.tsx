import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Image, Text } from "react-native"
//screens
import CareDetailsScreen from "@care/screens/CareDetailsScreen"
import CareIndexScreen from "@care/screens/CareIndexScreen"
import EditCareScreen from "@care/screens/EditCareScreen"
import NewCareScreen from "@care/screens/NewCareScreen"
import EditHealthScreen from "@health/screens/EditHealthScreen"
import HealthDetailsScreen from "@health/screens/HealthDetails"
import HealthIndexScreen from "@health/screens/HealthIndexScreen"
import NewHealthScreen from "@health/screens/NewHealthScreen"
import HomeScreen from "@home/HomeScreen"
import EditMorePetDetailsScreen from "@pet/screens/EditMorePetDetailsScreen"
import EditPetScreen from "@pet/screens/EditPetScreen"
import MorePetDetailsScreen from "@pet/screens/MorePetDetailsScreen"
import NewPetScreen from "@pet/screens/NewPetScreen"
import PetDetailsScreen from "@pet/screens/PetDetailsScreen"
import PetIndexScreen from "@pet/screens/PetIndexScreen"
import EditAccountScreen from "@profile/screens/EditAccountScreen"
import EditProfileScreen from "@profile/screens/EditProfileScreen"
import ProfileScreen from "@profile/screens/ProfileScreen"
import SettingsScreen from "@profile/screens/SettingsScreen"
import NewStatScreen from "@stat/screens/NewStatScreen"
import StatDetails from "@stat/screens/StatDetails"
//helpers
import { getNavigationIconSource } from "@utils/ui"
import { HomeTabParamList, RootStackParamList } from "./types"
//styles
import { Typography } from "@styles/index"
import { dynamicStackOptions, styles, tabBarOptions } from "./NavigationStyles"

const HomeTabs = () => {
  const Tab = createBottomTabNavigator<HomeTabParamList>()

  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        ...tabBarOptions,
        tabBarLabel: ({ focused }) => {
          return <Text style={[styles.iconLabel, focused ? {...Typography.focused} : {...Typography.unFocused}]}>{route.name}</Text>
        },
        tabBarIcon: ({ focused }) => {
          const iconSource = getNavigationIconSource(route.name, focused ? 'active' : 'inactive')
          return <Image source={iconSource} style={styles.icon } />
        },
      })}
    >
      <Tab.Screen name='Feed' component={HomeScreen} />
      <Tab.Screen name='Pets' component={PetIndexScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const PrivateApp = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>()

  return (
    <Stack.Navigator screenOptions={{ ...dynamicStackOptions('modal', true, false) }}>
      <Stack.Screen name='Home' component={HomeTabs} options={{ headerShown: false }} />

      <Stack.Group>
        <Stack.Screen name='CareIndex' component={CareIndexScreen} options={{ title: 'All Pet Care', ...dynamicStackOptions('card') }} />
        <Stack.Screen name='CareCreate' component={NewCareScreen} />
        <Stack.Screen name='CareEdit' component={EditCareScreen} options={{ title: 'Edit Task' }}/>
        <Stack.Screen name='CareDetails' component={CareDetailsScreen} options={dynamicStackOptions('card', true, false)} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name='HealthIndex' component={HealthIndexScreen} options={{ title: 'All Pet Health', ...dynamicStackOptions('card') }} />
        <Stack.Screen name='HealthCreate' component={NewHealthScreen} />
        <Stack.Screen name='HealthDetails' component={HealthDetailsScreen} />
        <Stack.Screen name='HealthEdit' component={EditHealthScreen} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name='PetCreate' component={NewPetScreen} />
        <Stack.Screen name='PetEdit' component={EditPetScreen} />
        <Stack.Screen name='PetDetails' component={PetDetailsScreen} />
        <Stack.Screen name='PetMoreDetails' component={MorePetDetailsScreen} />
        <Stack.Screen name='PetEditDetails' component={EditMorePetDetailsScreen} />
        <Stack.Screen name='CreateStat' component={NewStatScreen} options={{ title: 'New Log' }} />
        <Stack.Screen name='StatDetails' component={StatDetails} options={{ title: 'Details' }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name='ProfileEdit' component={EditProfileScreen} options={{ title: 'Edit Profile'}} />
        <Stack.Screen name='Settings' component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name='Account' component={EditAccountScreen} options={{ title: 'Edit Account' }} />
      </Stack.Group>

    </Stack.Navigator>
  )
}

export default PrivateApp