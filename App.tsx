import { GestureHandlerRootView } from 'react-native-gesture-handler'
//npm modules
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
//context
import { AuthProvider } from '@context/AuthContext'
import { PetProvider } from './context/PetContext'
import { ProfileProvider } from './context/ProfileContext'
import { CareProvider } from './context/CareContext'
import AppNavigator from '@navigation/AppNavigator'
//components



const App: React.FC = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PetProvider>
          <CareProvider>
            <ProfileProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <AppNavigator />
              </GestureHandlerRootView>
            </ProfileProvider>
          </CareProvider>
        </PetProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App


