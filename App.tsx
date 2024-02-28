import { GestureHandlerRootView } from 'react-native-gesture-handler'
//npm modules
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
//context
import { AuthProvider } from '@auth/AuthContext'
import AppNavigator from '@navigation/AppNavigator'
//components



const App: React.FC = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App


