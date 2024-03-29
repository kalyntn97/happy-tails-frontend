//npm modules
import { FC, useState } from 'react'
import { View, StyleSheet, TextInput, Text, Alert, SafeAreaView } from 'react-native'
import LottieView from 'lottie-react-native'
//context
import { useAuth } from '@auth/AuthContext'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { GoBackButton, MainButton, SubButton } from '@components/ButtonComponent'

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
    <SafeAreaView style={styles.container}>
      <GoBackButton top={50} onPress={() => navigation.goBack()}/>
      <LottieView source={require('@assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} />
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
        <MainButton title='Submit' onPress={login} top={40} bottom={0} />
        <SubButton title='Create Account' onPress={() => navigation.navigate('Register')} top={0} bottom={0} />
      </View>
    </SafeAreaView>
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
})

export default LoginScreen