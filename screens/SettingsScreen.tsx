import { View, Text, Button } from "react-native"
import { useAuth } from "../context/AuthContext"

const SettingsScreen = () => {
  const { onLogout } = useAuth()

  const logout = async () => {
    const result = await onLogout!()
    if (result && result.error) {
      alert(result.status)
    }
  }

  return ( 
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}
 
export default SettingsScreen