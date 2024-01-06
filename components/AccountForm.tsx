//npm modules
import { useState } from "react"
import { Keyboard, StyleSheet, View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface AccountFormProps {
  changePwOnly: boolean
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountForm: React.FC<AccountFormProps> = ({ changePwOnly, setShowForm }) => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConf, setPasswordConf] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleSubmit = () => {
    if ((!changePwOnly && !username) || !password || !passwordConf) {
      setErrorMsg('Please enter all required fields.')
    }
    if (password !== passwordConf) {
      setErrorMsg('Passwords do not match. Please re-enter.')
    }
    setErrorMsg('')
    if (changePwOnly) {

    } else {

    }
    
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={[{ backgroundColor: changePwOnly ? Colors.lightPink : !changePwOnly ? Colors.lightPink : 'white' }]}>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
        <View style={styles.form}>
          {!changePwOnly && 
            <TextInput 
              style={styles.input}
              placeholder="Username"
              onChangeText={(text: string) => setUsername(text)}
              value={username}
              autoComplete="off"
            />
          }
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text: string) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <TextInput 
            style={styles.input}
            placeholder="Confirm password"
            onChangeText={(text: string) => setPasswordConf(text)}
            value={passwordConf}
            secureTextEntry={true}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.mainBtn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subBtn} onPress={() => setShowForm(false)}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </TouchableWithoutFeedback>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered
  },
  errorMsg: {
    color: Colors.red,
    fontWeight: 'bold',
    margin: 5,
    height: '5%'
  },
  form: {
    ...Forms.form,
    width: '90%',
    height: '85%'
  },
  input: {
    ...Forms.input,
    height: 40,
    margin: 5,
    borderColor: Colors.pink,
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