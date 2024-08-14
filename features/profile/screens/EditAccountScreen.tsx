//npm
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
//components
import AccountForm from '@profile/components/AccountForm'
import { GoBackButton } from '@components/ButtonComponent'
//styles
import { UI, Spacing, Typography, Colors } from '@styles/index'

interface EditAccountScreenProps {
  navigation: any
  route: { params: { form: string } }
}

const UpdateAccountForm = ({ navigation }) => {
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
          style={[styles.tabBtn, { borderBottomColor: showForm === 'password' ? Colors.pink.dark : Colors.shadow.darkest }]}>
          <Text style={[styles.btnText, { color: showForm === 'password' ? Colors.pink.dark : Colors.shadow.darkest }]}>Change Password</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          onPress={() => setShowForm('username')} 
          style={[styles.tabBtn, { borderBottomColor: showForm === 'username' ? Colors.pink.dark : Colors.shadow.darkest }]}>
          <Text style={[styles.btnText, { color: showForm === 'username' ? Colors.pink.dark : Colors.shadow.darkest }]}>Change Username</Text>
        </TouchableOpacity>
      </View>

      <AccountForm showForm={showForm} onSubmit={handleUpdateAccount}/>
      
    </View>
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
      <View style={styles.deleteHeaderCon}>
        <Text style={styles.btnText}>Delete Account?</Text>
      </View>
      <AccountForm showForm="delete" onSubmit={showDeleteConfirmDialog}/>
    </View>
  )
}

const EditAccountScreen: FC<EditAccountScreenProps> = ({ route, navigation }) => {
  const { form } = route.params
  
  return (
    <View style={styles.container}>
      {form === 'update' ? <UpdateAccountForm navigation={navigation} />
        : form === 'delete' ? <DeleteAccountForm />
        : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullCon(),
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
    ...Typography.smallHeader,
    margin: 0,
    padding: 5,
    alignSelf: 'center',
  },
  btnContainer: {
    width: '100%',
    height: '15%',
    ...Spacing.flexRow,
  },
  tabBtn: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 2,
    backgroundColor: Colors.white,
  },
  mainBtn: {
    ...Spacing.flexRow,
  margin: 10
  },
  icon: {
    ...UI.icon()
  },
  deleteHeaderCon: {
    backgroundColor: Colors.white,
    marginBottom: 2,
    height: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
})

export default EditAccountScreen
