// import { StatusBar } from 'expo-status-bar'
//npm modules
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
//context
import { AuthProvider } from './context/AuthContext'
import { PetProvider } from './context/PetContext'
//components
import Layout from './components/Layout'

const App: React.FC = () => {
  
  return (
    <AuthProvider>
      <PetProvider>
        <Layout></Layout>
      </PetProvider>
    </AuthProvider>
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

