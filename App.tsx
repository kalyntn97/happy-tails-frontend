// import { StatusBar } from 'expo-status-bar'
//npm modules
import * as React from 'react'
//context
import { AuthProvider } from './context/AuthContext'
import { PetProvider } from './context/PetContext'
import { ProfileProvider } from './context/ProfileContext'
//components
import Layout from './components/Layout'

const App: React.FC = () => {
  
  return (
    <AuthProvider>
      <ProfileProvider>
        <PetProvider>
          <Layout></Layout>
        </PetProvider>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App


