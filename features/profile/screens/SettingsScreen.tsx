//npm modules
import { useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native"
//component
import AccountForm from "../components/AccountForm"
import ToggleableForm from "@components/ToggleableForm"
//context
import { useAuth } from "@auth/AuthContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface AccountProps {
  navigation: any
  route: { params: {  } }
}

const SettingsScreen: React.FC<AccountProps> = ({ navigation, route }) => {
  const { onLogout, onDeleteAccount } = useAuth()
  const [visible, setVisible] = useState<string>('')

  const titleData = ['Update account information', 'Delete account and all pet profiles', 'Log out of account']


  const logout = async () => {
    const { status, error } = await onLogout!()
    console.log(status)
    return Alert.alert(
      'Alert',
      status ?? error,
      [{ text: 'OK' }]
    )
  }

  const DeleteAccountForm = () => {
    const deleteProfile = async (username: string, password: string) => {
      await onDeleteAccount!(username, password)
    }

    const showDeleteConfirmDialog = (username: string, password: string) => {
      return Alert.alert(
        'Are you sure?',
        `Delete your account? This is irreversible.`, 
        [
          { text: 'Yes', onPress: () => { deleteProfile(username, password) }},
          { text: 'No' }
        ]
      )
    }

    return (
      <View style={styles.deleteForm}>
        <AccountForm showForm="delete" onSubmit={showDeleteConfirmDialog}/>
      </View>
    )
  }

  const UpdateAccountForm = () => {
    const [showForm, setShowForm] = useState<string>('password')
    
    const handleUpdateAccount = async (username: string, password: string) => {
      showForm === 'password'
        ? await onChangePassword!(username, password)
        : await onChangeUsername!(username, password)
      navigation.navigate('Settings')
    }

    return (
      <View style={styles.updateForm}>
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            onPress={() => setShowForm('password')} 
            style={[styles.tabBtn, { backgroundColor: showForm === 'password' ? Colors.white : Colors.lightestPink}]}>
            <Text style={[styles.btnText, { color: showForm === 'password' ? Colors.darkPink : 'black' }]}>Change {'\n'}Password</Text>
          </TouchableOpacity>
        
          <TouchableOpacity 
            onPress={() => setShowForm('username')} 
            style={[styles.tabBtn, { backgroundColor: showForm === 'username' ? Colors.white : Colors.lightestPink}]}>
            <Text style={[styles.btnText, { color: showForm === 'username' ? Colors.darkPink : 'black' }]}>Change Username</Text>
          </TouchableOpacity>
        </View>

        <AccountForm showForm={showForm} onSubmit={handleUpdateAccount}/>
        
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
      <Pressable style={styles.headingBtn} onPress={() => setVisible(visible === titleData[0] ? '' : titleData[0])}>
        <ToggleableForm
          visible={visible}
          title={titleData[0]}
          content={ <UpdateAccountForm /> } 
        />
      </Pressable>

      <Pressable style={styles.headingBtn} onPress={() => setVisible(visible === titleData[1] ? '' : titleData[1])}>
        <ToggleableForm
          visible={visible}
          title={titleData[1]}
          content={ <DeleteAccountForm /> }
        />
      </Pressable>

      <Pressable style={styles.headingBtn} onPress={() => setVisible(visible === titleData[2] ? '' : titleData[2])}>
        <ToggleableForm
          visible={visible}
          title={titleData[2]}
          content={
            <TouchableOpacity onPress={logout} style={[styles.mainBtn, styles.warn, { backgroundColor: Colors.darkPink }]}>
              <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
          }
        />
      </Pressable>
      

    </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    backgroundColor: Colors.lightestPink,
  },
  scrollViewContent: {
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  headingBtn: {
    width: '100%',
    alignItems: 'center',
  },
  updateForm: {
    width: '90%',
    height: 400,
    alignItems: 'center',
  },
  deleteForm: {
    width: '90%',
    height: 350,
    justifyContent: 'center',
  },
  btnText: {
    ...Typography.xSmallHeader,
    margin: 0,
    padding: 5,
    alignSelf: 'center',
  },
  btnContainer: {
    width: '100%',
    height: '20%',
    ...Spacing.flexRow,
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

export default SettingsScreen