//npm
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import { Image, Text, StyleSheet, View } from "react-native"
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
import EditPetDetailsScreen from "@pet/screens/EditPetDetailsScreen"
//components
import { GoBackButton } from "@components/ButtonComponent"
//helpers
import { getNavigationIconSource } from "@utils/ui"
//styles
import { Colors, Forms, Typography, Spacing } from "@styles/index"

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
            screenOptions={() => ({ headerShown: false, ...presentationOptions })}
          >
            <HomeStack.Screen name='Main' component={HomeScreen} />
            <HomeStack.Screen name='Care'>
              {() => (
                <CareStack.Navigator screenOptions={{ ...stackOptions, }}>
                  <CareStack.Screen name='Index' component={CareIndexScreen} options={{ title: 'All Pet Care'}}/>
                  <CareStack.Screen name='Create' component={NewCareScreen} options={{ title: 'Add a Task' }}/>
                  <CareStack.Screen name='Details' component={CareDetailsScreen} options={{ header: ({ navigation }) => {
                    return (
                      <NoTitleHeader navigation={navigation} />
                    )
                  } }}/>
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
                  <HealthStack.Screen name='Details' component={HealthDetailsScreen} options={{ header: ({ navigation }) => {
                    return (
                      <NoTitleHeader navigation={navigation} />
                    )
                  } }} />
                </HealthStack.Navigator>
              )}
            </HomeStack.Screen>
        
          </HomeStack.Navigator> 
        )}
      </Tab.Screen>

      <Tab.Screen name='Pets'>
        {() => (
          <PetStack.Navigator
            screenOptions={{ ...stackOptions, ...presentationOptions }}
          >
            <PetStack.Screen name='Index' component={PetIndexScreen} 
              options={{ header: () => {
                return (
                  <TitleOnlyHeader title='All Pets' />
                )
              } }} 
            />
            <PetStack.Screen name='Create' component={NewPetScreen} options={{ title: 'Add a Pet' }}
            />
            <PetStack.Screen name='Edit' component={EditPetScreen} options={({ route }) => ({ title: 'Edit Pet' })} />
            <PetStack.Screen name='Details' options={{ headerShown: false }}>
              {() => (
                <DetailStack.Navigator screenOptions={{ ...stackOptions }}>
                  <DetailStack.Screen name='Index' component={PetDetailsScreen} options={{ header: ({ navigation }) => {
                    return (
                      <NoTitleHeader navigation={navigation} />
                    )
                  } }} />
                  <DetailStack.Screen name='Edit' component={EditPetDetailsScreen} options={{ title: 'Edit Details' }} />
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
          <ProfileStack.Navigator screenOptions={{ ...stackOptions, ...presentationOptions }}>
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

const baseHeaderStyle: any = {
  headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
  header: ({ navigation, options }) => {
    const title = options.title
    return (
      <Header title={title} navigation={navigation} />
    )
  }
}

const coloredHeaderStyle: any = {
  ...baseHeaderStyle,
  headerStyle: { backgroundColor: Colors.pink.lightest },
  headerTintColor: Colors.pink.darkest,
}

const headerStyle: any = {
  ...baseHeaderStyle,
  headerStyle: { backgroundColor: Colors.shadow.lightest },
  headerTintColor: Colors.black,
}

const contentStyle: NativeStackNavigationOptions = {
  contentStyle: { backgroundColor: Colors.shadow.lightest },
}

const stackOptions: NativeStackNavigationOptions = {
  ...headerStyle,
  ...contentStyle,
}

const presentationOptions: NativeStackNavigationOptions = {
  presentation: 'modal',
  gestureEnabled: true,
}

const tabBarOptions: BottomTabNavigationOptions = {
  tabBarStyle: { padding : 10, height: 100, backgroundColor: Colors.white},
  headerShown: false,
}

const Header = ({ title, navigation }: { title: string, navigation: any }) => (
  <View style={styles.headerCon}>
    <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={10} left={10} />
    <Text style={styles.headerText}>{title}</Text>
  </View>
)

const TitleOnlyHeader = ({ title }: { title: string }) => (
  <View style={[styles.headerCon, ]}>
    <Text style={[styles.headerText, { marginTop: 50 }]}>{title}</Text>
  </View>
)

const NoTitleHeader = ({ navigation }) => (
  <GoBackButton onPress={() => navigation.goBack()} position="topLeft" top={10} left={10} />
)

const styles = StyleSheet.create({
  icon: { ...Forms.icon },
  iconLabel: { fontWeight: 'bold' },
  headerText: {
    ...Typography.mediumHeader, color: Colors.pink.darkest, marginTop: 30,
  },
  headerCon: { 
    backgroundColor: Colors.shadow.lightest, height: 100
  },
})

export default PrivateApp