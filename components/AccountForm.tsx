//npm modules
import { useEffect, useState } from "react"
import { Keyboard, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
// context
import { useAuth } from "@context/AuthContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
import { show } from "@services/petService"

interface AccountFormProps {
  showForm: string
  onSubmit: (username: string, password: string) => Promise<any>
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: showForm === 'password' ? Colors.white : showForm !== 'password' ? Colors.white : Colors.lightestPink }]}>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
        <View style={styles.form}>
          <TextInput 
            style={styles.input}
            placeholder={showForm === 'username' ? 'New Username' : 'Current Username'}
            onChangeText={(text: string) => setUsername(text)}
            value={username}
            autoComplete="off"
          />
          {showForm === 'username' &&
            <TextInput 
              style={styles.input}
              placeholder={'Confirm New Username'}
              onChangeText={(text: string) => setUsernameConf(text)}
              value={usernameConf}
              autoComplete="off"
            />
          }
          
          <TextInput
            style={styles.input}
            placeholder={showForm === 'password' ? 'New Password' : 'Current Password'}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <TextInput 
            style={styles.input}
            placeholder={showForm === 'password' ? 'Confirm New Password' : 'Confirm Current Password'}
            onChangeText={(text: string) => setPasswordConf(text)}
            value={passwordConf}
            secureTextEntry={true}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.mainBtn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </TouchableWithoutFeedback>
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
  errorMsg: {
    color: Colors.red,
    fontWeight: 'bold',
    margin: 5,
    height: '3%'
  },
  form: {
    ...Forms.form,
    width: '100%',
    height: '90%'
  },
  input: {
    ...Forms.input,
    height: 40,
    margin: 5,
    borderColor: Colors.pink,
    backgroundColor: Colors.lightestPink,
  },
  mainBtn: {
    ...Buttons.smallRounded,
    height: 40,
    margin: 10,
    backgroundColor: Colors.pink
  },
  subBtn: {
    ...Buttons.smallSub,
    height: 40
  },
  btnText: {
    ...Buttons.buttonText,
    color: Colors.darkestPink
  },
  btnContainer: {
    ...Spacing.flexRow
  }
})

export default AccountForm