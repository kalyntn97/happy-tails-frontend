import LottieView from 'lottie-react-native'
import { ActivityIndicator } from 'react-native'
//context
import { useAuth } from '@auth/AuthContext'
//utils & hooks
import { AuthFormData } from '@auth/AuthInterface'
import useForm from '@hooks/useForm'
import { StackScreenNavigationProp } from '@navigation/types'
import { showToast } from '@utils/misc'
//components
import { MainButton, SubButton } from '@components/ButtonComponents'
import { FormHeader, FormInput, ScrollScreen } from '@components/UIComponents'
//styles
import { styles } from '@styles/stylesheets/FormStyles'

type Props = {
  navigation: StackScreenNavigationProp
}

const LoginScreen = ({ navigation }: Props) => {
  const initialState: AuthFormData = {
    username: null,
    password: null,
    errors: {},
    isPending: false,
  }
  const { values, onChange, onValidate } = useForm(login, initialState)
  const { username, password, errors, isPending }: AuthFormData = values

  const { onLogin } = useAuth()

  function handleValidate() {
    onValidate({ username, password })
  }

  async function login()  {
    onChange('isPending', true)
    const { status, error } = await onLogin!(username, password)
    onChange('isPending', false)
    showToast({ text1: status ?? error, style: error ? 'error' : 'success' })

    navigation.navigate('Home', { screen: 'Feed' })
  }

  return (
    <ScrollScreen>
      <LottieView source={require('@assets/animations/writing-cat.json')} autoPlay loop style={styles.catAnimation} />
      <FormHeader title='Sign in' size='large' styles={{ marginTop: 0, marginBottom: 20 }} />

      <FormHeader title='Username' size='small' styles={{ marginVertical: 10 }} />
      <FormInput initial={username} placeholder='Enter username' onChange={(text: string) => onChange('username', text)} error={errors?.username} width='60%' props={{ autoComplete: 'username' }} />

      <FormHeader title='Password' size='small' styles={{ marginTop: 30, marginBottom: 10 }} />
      <FormInput initial={username} placeholder='Enter password' onChange={(text: string) => onChange('password', text)} error={errors?.password} width='60%' props={{ autoComplete: 'current-password' }} type='password' />
 
      <MainButton title={isPending ? <ActivityIndicator /> : 'Submit'} onPress={handleValidate} buttonStyles={{ marginTop: 60 }} />
      <SubButton title='Create Account' onPress={() => navigation.navigate('Register')} />
    </ScrollScreen>
  )
}

export default LoginScreen