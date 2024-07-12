import { GestureHandlerRootView } from 'react-native-gesture-handler'
//npm modules
import Toast from 'react-native-toast-message'
import * as React from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
//context
import { AuthProvider } from '@auth/AuthContext'
//components & utils
import AppNavigator from '@navigation/AppNavigator'
import { showToast } from '@utils/misc'
import { toastConfig } from '@components/UIComponents'

const App: React.FC = () => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) =>
        showToast({ text1: 'Something went wrong.', style: 'error' })
    }),
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App


