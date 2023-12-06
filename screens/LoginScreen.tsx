//npm modules
import { useState } from 'react'
import { View, StyleSheet, TextInput, Button } from 'react-native'
//context
import { useAuth } from '../context/AuthContext'

const LoginScreen = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { onLogin, onRegister } = useAuth()

  const login = async () => {
    const result = await onLogin!(username, password)
    if (result && result.error) {
      alert(result.status)
    }
  }

  const register = async () => {
    const result = await onRegister!(username, password)
    if (result && result.error) {
      alert(result.msg)
    } else {
      login()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder='Username' 
          onChangeText={(text: string) => setUserName(text)} 
          value={username} 
          autoCapitalize='none'
        />
        <TextInput 
          style={styles.input} 
          placeholder='Password' 
          onChangeText={(text: string) => setPassword(text)} 
          value={password} 
          secureTextEntry={true}
        />
        <Button onPress={login} title='Sign in' />
        <Button onPress={register} title='Create Account' />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
})

export default LoginScreen