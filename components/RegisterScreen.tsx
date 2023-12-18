//npm modules
import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Button, Pressable, Text } from 'react-native'
import LottieView from 'lottie-react-native'
//context
import { useAuth } from '../context/AuthContext'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const RegisterScreen = () => {
  const [name, setName] = useState<string>('')
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConf, setPasswordConf] = useState<string>('')
  const { onLogin, onRegister } = useAuth()

  const register = async () => {
    if (password === passwordConf) {
      const result = await onRegister!(name, username, password)
      console.log(result)
      if (result && result.error) {
        alert(result.msg)
      } else {
        const next = await onLogin!(username, password)
        if (next && next.error) {
          alert(next.status)
        }
      }
    } else {
      alert('Passwords do not match!')
    }
  }

  return ( 
    <View style={styles.container}>
      {/* <LottieView source={require('../assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} /> */}
      <Text style={styles.header}>Create Account</Text>
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder='Name' 
          onChangeText={(text: string) => setName(text)} 
          value={name} 
        />
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
        <TextInput 
          style={styles.input} 
          placeholder='Confirm Password' 
          onChangeText={(text: string) => setPasswordConf(text)} 
          value={passwordConf} 
          secureTextEntry={true}
        />
        <Pressable onPress={register} style={styles.mainButton}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  // catAnimation: {
  //   width: '60%',
  // },
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
  buttonText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  }
})

export default RegisterScreen