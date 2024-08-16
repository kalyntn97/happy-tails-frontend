import { GestureHandlerRootView } from 'react-native-gesture-handler'
//npm modules
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
//context
import { AuthProvider } from '@auth/AuthContext'
//components & utils
import { CustomToast } from '@components/UIComponents'
import AppNavigator from '@navigation/AppNavigator'
import { showToast } from '@utils/misc'

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
          <CustomToast />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App


