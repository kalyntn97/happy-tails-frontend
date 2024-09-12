import { ActivityIndicator } from 'react-native'
//context
import { useAuth } from '@auth/AuthContext'
//components
import { MainButton, SubButton } from '@components/ButtonComponents'
import { FormHeader, FormInput, ScrollScreen } from '@components/UIComponents'
//utils & hooks
import { AuthFormData } from '@auth/AuthInterface'
import useForm from '@hooks/useForm'
import { StackScreenNavigationProp } from '@navigation/types'
import { showToast } from '@utils/misc'

type Props = {
  navigation: StackScreenNavigationProp
}

interface InitialState extends AuthFormData {
  name: string
  passwordConf: string
}

const RegisterScreen = ({ navigation }: Props) => {
  const initialState: InitialState = {
    name: null,
    username: null,
    password: null,
    passwordConf: null,
    errors: {},
    isPending: false,
  }

  const { values, onChange, onValidate } = useForm(register, initialState)
  const { name, username, password, passwordConf, errors, isPending }: InitialState = values

  const { onRegister } = useAuth()

  function handleValidate() {
    onValidate({ name, username, password })
  }

  async function register() {
    if (password === passwordConf) { 
      const updatedErrors = delete errors.passwordConf
      onChange('errors', { ...errors, updatedErrors })
      onChange('isPending', true)
      const { status, error } = await onRegister!(name, username, password)
      onChange('isPending', false)
      showToast({ text1: status ?? error, style: error ? 'error' : 'success' })
      navigation.navigate('Home', { screen: 'Feed' })
    } else {
      onChange('errors', { ...errors, ['passwordConf']: 'Passwords do not match' })
    }
  }

  return ( 
    <ScrollScreen>
      {/* <LottieView source={require('@assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} /> */}
      <FormHeader title='Create account' size='large' styles={{ marginTop: 0, marginBottom: 20 }} />
      
      <FormHeader title='Name' size='small' styles={{ marginVertical: 10 }} />
      <FormInput initial={name} placeholder='Enter name' onChange={(text: string) => onChange('name', text)} error={errors?.name} width='60%' />

      <FormHeader title='Username' size='small' styles={{ marginTop: 30, marginBottom: 10 }} />
      <FormInput initial={username} placeholder='Enter username' onChange={(text: string) => onChange('username', text)} error={errors?.username} width='60%' />

      <FormHeader title='Password' size='small' styles={{ marginTop: 30, marginBottom: 10 }} />
      <FormInput initial={password} placeholder='Enter password' onChange={(text: string) => onChange('password', text)} error={errors?.password} width='60%' type='password' />

      <FormHeader title='Confirm Password' size='small' styles={{ marginTop: 30, marginBottom: 10 }} />
      <FormInput initial={passwordConf} placeholder='Confirm password' onChange={(text: string) => onChange('passwordConf', text)} error={errors?.passwordConf} width='60%' type='password' />

      <MainButton title={isPending ? <ActivityIndicator /> : 'Submit'} onPress={handleValidate} buttonStyles={{ marginTop: 60 }} />
      <SubButton title='Sign in' onPress={() => navigation.navigate('Login')} />
    </ScrollScreen>
  )
}

export default RegisterScreen