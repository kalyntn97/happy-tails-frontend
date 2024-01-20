import 'react-native-gesture-handler'
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
      <PetProvider>
        <ProfileProvider>
          <Layout />
        </ProfileProvider>
      </PetProvider>
    </AuthProvider>
  )
}

export default App


