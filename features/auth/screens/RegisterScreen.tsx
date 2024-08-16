//npm modules
import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Pressable, Text, Alert, SafeAreaView } from 'react-native'
import LottieView from 'lottie-react-native'
//context
import { useAuth } from '@auth/AuthContext'
//components
import { GoBackButton, MainButton, SubButton } from '@components/ButtonComponents'
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { styles } from '@styles/stylesheets/FormStyles'


const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState<string>('')
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConf, setPasswordConf] = useState<string>('')
  const { onRegister } = useAuth()

  const register = async () => {
    if (password === passwordConf) {
      const { status, error } = await onRegister!(name, username, password)
      
      navigation.navigate('Home', { screen: 'Welcome' })

      return Alert.alert(
        'Alert',
        status ?? error,
        [{ text: 'OK' }]
      )
    } else {
      alert('Passwords do not match!')
    }
  }

  return ( 
    <SafeAreaView style={styles.container}>
      <LottieView source={require('@assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} />
      <Text style={styles.header}>Create Account</Text>
      <TextInput 
        style={styles.input} 
        placeholder='Name'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => setName(text)} 
        value={name} 
      />
      <TextInput 
        style={styles.input} 
        placeholder='Username'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => setUserName(text)} 
        value={username} 
        autoCapitalize='none'
      />
      <TextInput 
        style={styles.input} 
        placeholder='Password'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => setPassword(text)} 
        value={password} 
        secureTextEntry={true}
      />
      <TextInput 
        style={styles.input} 
        placeholder='Confirm Password'
        placeholderTextColor={Colors.shadow.reg}
        onChangeText={(text: string) => setPasswordConf(text)} 
        value={passwordConf} 
        secureTextEntry={true}
      />
      <MainButton title='Submit' onPress={register} top={40} bottom={0} />
      <SubButton title='Sign in' onPress={() => navigation.navigate('Login')} top={0} bottom={0} />
    </SafeAreaView>
  )
}

export default RegisterScreen