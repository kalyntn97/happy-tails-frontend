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
    navigation.navigate('Account')
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[{ backgroundColor: changePwOnly ? Colors.lightPink : !changePwOnly ? Colors.lightPink : 'white' }]}>
        <View style={styles.header}>
          {/* <Text style={styles.headerText}>{changePwOnly ? 'Change Password' : 'Edit Account'}</Text> */}
          <Text style={styles.errorMsg}>{errorMsg}</Text>
        </View>
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
    ...Spacing.fullWH,
    ...Spacing.flexColumn,
    ...Spacing.centered,
  },
  errorMsg: {
    color: Colors.red,
    fontWeight: 'bold',
    margin: 5
  },
  form: {
    ...Forms.form,
    height: '90%',
    width: '90%',
  },
  input: {
    ...Forms.input,
    borderColor: Colors.pink,
  },
  mainBtn: {
    ...Buttons.smallRounded,
    margin: 10,
    backgroundColor: Colors.pink
  },
  subBtn: {
    ...Buttons.smallSub
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