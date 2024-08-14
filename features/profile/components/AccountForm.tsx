//npm modules
import { useEffect, useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { MainButton } from "@components/ButtonComponent"
import { ErrorMessage } from "@components/UIComponents"

interface AccountFormProps {
  showForm: string
  onSubmit: (username: string, password: string) => void
}

const AccountForm: React.FC<AccountFormProps> = ({ showForm, onSubmit }) => {
  const [username, setUsername] = useState<string>('')
  const [usernameConf, setUsernameConf] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConf, setPasswordConf] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleSubmit = async () => {
    if (!username || !password || !passwordConf || (showForm === 'username' && !usernameConf)) {
      setErrorMsg('Please enter all required fields.')
      return
    }
    if (password !== passwordConf) {
      setErrorMsg('Passwords do not match. Please re-enter.')
      return
    }
    if (showForm === 'username' && username !== usernameConf) {
      setErrorMsg('Usernames do not match. Please re-enter.')
      return
    }
    await onSubmit(username, password)
    setErrorMsg('')
  }

  useEffect(() => {
    const refreshForm = () => {
      setErrorMsg('')
    }
    refreshForm()
  }, [showForm])

  return (
    <View style={[styles.container, { backgroundColor: showForm === 'password' ? Colors.white : showForm !== 'password' ? Colors.white : Colors.pink.lightest }]}>
      {errorMsg && <ErrorMessage error={errorMsg} />}
      <View style={styles.form}>
        <TextInput 
          style={styles.input}
          placeholder={showForm === 'username' ? 'New Username' : 'Current Username'}
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => setUsername(text)}
          value={username}
          autoComplete="off"
        />
        {showForm === 'username' &&
          <TextInput 
            style={styles.input}
            placeholder={'Confirm New Username'}
            placeholderTextColor={Colors.shadow.reg}
            onChangeText={(text: string) => setUsernameConf(text)}
            value={usernameConf}
            autoComplete="off"
          />
        }
        
        <TextInput
          style={styles.input}
          placeholder={showForm === 'password' ? 'New Password' : 'Current Password'}
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TextInput 
          style={styles.input}
          placeholder={showForm === 'password' ? 'Confirm New Password' : 'Confirm Current Password'}
          placeholderTextColor={Colors.shadow.reg}
          onChangeText={(text: string) => setPasswordConf(text)}
          value={passwordConf}
          secureTextEntry={true}
        />
        <MainButton title='Submit' size='small' onPress={handleSubmit} />
      </View>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '80%',
    ...Spacing.centered,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  form: {
    ...UI.form,
    height: '90%'
  },
  input: {
    ...UI.input(),
    height: 40,
    margin: 5,
    borderColor: Colors.pink.reg,
    backgroundColor: Colors.pink.lightest,
  },
})

export default AccountForm