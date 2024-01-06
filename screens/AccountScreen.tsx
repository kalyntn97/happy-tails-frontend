//npm modules
import { useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native"
//component
import AccountForm from "../components/AccountForm"
import ToggleableForm from "../components/ToggleableForm"
//context
import { useAuth } from "../context/AuthContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface AccountProps {
  navigation: any
  route: { params: {  } }
}

const AccountScreen: React.FC<AccountProps> = ({ navigation, route }) => {
  const { onLogout } = useAuth()

  const logout = async () => {
    const result = await onLogout!()
    if (result && result.error) {
      alert(result.status)
    }
  }

  const UpdateAccountForm = () => {
    const [changePwOnly, setChangePwOnly] = useState(false)
    const [showForm, setShowForm] = useState(false)
    
    return (
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
    )
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      style={styles.scrollView}
      scrollEventThrottle={200}
      decelerationRate="fast"
      pagingEnabled
    >
      <ToggleableForm 
        title='Update account information' 
        content={ <UpdateAccountForm /> } 
      />
      
      <ToggleableForm 
        title='Delete account and all pet profiles'
        content={ 
          <TouchableOpacity style={[styles.mainBtn, styles.warn, { backgroundColor: Colors.red }]}>
            <Text style={styles.btnText}>Delete account</Text>
          </TouchableOpacity>
        }
      />

      <ToggleableForm
        title='Log out of account'
        content={
          <TouchableOpacity onPress={logout} style={[styles.mainBtn, styles.warn, { backgroundColor: Colors.darkPink }]}>
            <Text style={styles.btnText}>Logout</Text>
          </TouchableOpacity>
        }
      />

    </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    
    alignItems: 'center'
  },
  formContainer: {
    width: '90%',
    height: 350,
  }, 
  btnText: {
    ...Typography.smallHeader,
    margin: 0,
    padding: 5,
    alignSelf: 'center',
  },
  btnContainer: {
    width: '100%',
    height: '20%',
    ...Spacing.flexRow,
  },
  form: {
    height: '80%',
    width: '100%',
    ...Spacing.centered,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  tabBtn: {
    width: '50%',
    height: '100%',
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
    ...Buttons.xSmallSquare,
    width: '80%',
   },
})

export default AccountScreen