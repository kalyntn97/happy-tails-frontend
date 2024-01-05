//npm modules
import { useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
//component
import AccountForm from "../components/AccountForm"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'


interface AccountProps {
  navigation: any
  route: { params: {  } }
}

const AccountScreen: React.FC<AccountProps> = ({ navigation, route }) => {
  const [changePwOnly, setChangePwOnly] = useState(false)
  const [showForm, setShowForm] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mainBtn} onPress={() => setShowForm(!showForm)}>
        <Image source={require('../assets/icons/dropdownRound.png')} style={styles.icon} />
        <Text style={[styles.btnText, { color: showForm ? Colors.darkPink : 'black' }]}>Update user information</Text>
      </TouchableOpacity>
      { showForm &&
        <View style={styles.formContainer}>
          <View style={styles.btnContainer}>
            <TouchableOpacity 
              onPress={() => setChangePwOnly(true)} 
              style={[styles.tabBtn, { backgroundColor: changePwOnly ? Colors.lightPink : 'white'}]}>
              <Text style={[styles.btnText, { color: changePwOnly ? Colors.darkPink : 'black' }]}>Change Password</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              onPress={() => setChangePwOnly(false)} 
              style={[styles.tabBtn, { backgroundColor: !changePwOnly ? Colors.lightPink : 'white'}]}>
              <Text style={[styles.btnText, { color: !changePwOnly ? Colors.darkPink : 'black' }]}>Change Username</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.form, { backgroundColor: changePwOnly ? Colors.lightPink : !changePwOnly ? Colors.lightPink : 'white' }]}>
            { changePwOnly
              ? <AccountForm changePwOnly={true} setShowForm={setShowForm} />
              : <AccountForm changePwOnly={false} setShowForm={setShowForm} />
            }
          </View>
        </View>
      }

      <TouchableOpacity style={[ styles.mainBtn, styles.warn ]}>
        <Text style={[ styles.btnText]}>Delete account and all pet profiles</Text>
      </TouchableOpacity>
    </View>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.fullWH,
    alignItems: 'center'
  },
  formContainer: {
    width: '90%',
    height: '80%',
    ...Spacing.centered,
  },
  btnText: {
    ...Typography.smallHeader,
    margin: 0,
    padding: 5,
    alignSelf: 'center',
  },
  btnContainer: {
    width: '90%',
    height: '10%',
    ...Spacing.flexRow,
  },
  form: {
    height: '70%',
    width: '90%',
    ...Spacing.centered,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  tabBtn: {
    width: '50%',
    height: 'auto',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,

  },
   mainBtn: {
    ...Spacing.flexRow,
    margin: 10
   },
   icon: {
    ...Forms.smallIcon
   },
   warn: {
    ...Buttons.longSquare,
    width: '80%',
    backgroundColor: Colors.red
   }
})

export default AccountScreen