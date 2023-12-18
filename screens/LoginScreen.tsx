//npm modules
import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Button, Pressable, Text } from 'react-native'
import LottieView from 'lottie-react-native'
//context
import { useAuth } from '../context/AuthContext'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const LoginScreen: React.FC = () => {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
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
      <LottieView source={require('../assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} />
      <Text style={styles.header}>Sign in</Text>
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
        <Pressable onPress={login} style={styles.mainButton}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
        <Pressable onPress={register} style ={styles.subButton}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  catAnimation: {
    width: '60%',
  },
  header: {
    ...Typography.mainHeader,
    marginTop: 0,
    color: Colors.darkPink,
  },
  form: {
    ...Forms.form,
  },
  input: {
    ...Forms.input,
    borderColor: Colors.pink,
  },
  mainButton: {
    ...Buttons.smallRounded,
    marginTop: 50,
    backgroundColor: Colors.pink
  },
  subButton: {
    ...Buttons.smallSub,
    borderColor: Colors.darkestPink
  },
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  }
})

export default LoginScreen