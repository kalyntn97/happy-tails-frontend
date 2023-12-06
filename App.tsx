// import { StatusBar } from 'expo-status-bar'
//npm modules
import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
//context
import { AuthProvider, useAuth } from './context/AuthContext'
//components
import HomeScreen from './screens/HomeScreen'
import SettingsScreen from './screens/SettingsScreen'
import LoginScreen from './screens/LoginScreen'
import PetsScreen from './screens/PetsScreen'

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  )
}

export const Layout = () => {
  const Tab = createBottomTabNavigator()
  const { authState, onLogout } = useAuth()
  return ( 
    <NavigationContainer>
      <Tab.Navigator>
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

export default App
/* const styles  = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */

