//npm modules
import { FC, useState } from 'react'
import { View, StyleSheet, TextInput, Pressable, Text, Alert } from 'react-native'
import LottieView from 'lottie-react-native'
//context
import { useAuth } from '../context/AuthContext'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const LoginScreen: FC = ({ navigation }) => {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const { onLogin } = useAuth()

  const login = async () => {
    const { status, error } = await onLogin!(username, password)
    navigation.navigate('Home', { screen: 'Welcome' })

    return Alert.alert(
      'Alert',
      status ?? error,
      [{ text: 'OK' }]
    )
  }

  return (
    <View style={styles.container}>
      <LottieView source={require('../assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} />
      <Text style={styles.header}>Sign in</Text>
      <View style={styles.form}>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
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
        <Pressable onPress={() => navigation.navigate('Register')} style ={styles.subButton}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
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
  errorMsg: {
    color: Colors.red,
    fontWeight: 'bold'
  },
  input: {
    ...Forms.input,
    borderColor: Colors.pink,
  },
  mainButton: {
    ...Buttons.smallRounded,
    marginTop: 40,
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