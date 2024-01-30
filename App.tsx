import 'react-native-gesture-handler'
//npm modules
import * as React from 'react'
//context
import { AuthProvider } from './context/AuthContext'
import { PetProvider } from './context/PetContext'
import { ProfileProvider } from './context/ProfileContext'
//components
import Layout from './components/Layout'
import { CareProvider } from './context/CareContext'

const App: React.FC = () => {
  
  return (
    <AuthProvider>
      <PetProvider>
        <CareProvider>
          <ProfileProvider>
            <Layout />
          </ProfileProvider>
        </CareProvider>
      </PetProvider>
    </AuthProvider>
  )
}

export default App


