// import { StatusBar } from 'expo-status-bar'
//npm modules
import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
//context
import { AuthProvider } from './context/AuthContext'
//components
import Layout from './components/Layout'

const App: React.FC = () => {
  
  return (
    <AuthProvider>
      <Layout></Layout>
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

