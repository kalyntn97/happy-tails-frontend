//npm modules
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//component
import { BoxHeader } from "@components/HeaderComponent"
//context
import { useAuth } from "@auth/AuthContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface AccountProps {
  navigation: any
  route: { params: {  } }
}
export const settingTitles = {
  update: 'Update account information', 
  delete: 'Delete account and all pet profiles', 
  logout: 'Sign out of account', 
  weight: 'Change display unit: Weight', 
  food: 'Change display unit: Food', 
}

const SettingsScreen: React.FC<AccountProps> = ({ navigation }) => {
  const { onLogout, onDeleteAccount } = useAuth()
  const [weightUnit, setWeightUnit] = useState<string>('kg')
  const [foodUnit, setFoodUnit] = useState<string>('g')

  const isFocused = useIsFocused()

  const logout = async () => {
    const { status, error } = await onLogout!()
    return Alert.alert(
      'Alert',
      status ?? error,
      [{ text: 'OK' }]
    )
  }

  const showLogoutConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      'Log out of your account?', 
      [
        { text: 'Yes', onPress: () => { onLogout() }},
        { text: 'No' }
      ]
    )
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollViewContent}
      
    > 
      <Text style={styles.sectionHeader}>Account settings</Text>
      <View style={{ ...Forms.roundedCon }}>
        <BoxHeader title={settingTitles['update']} mode='light' onPress={() => navigation.navigate('Account', { form: 'update' })} />
        <BoxHeader title={settingTitles['delete']} mode='light' onPress={() => navigation.navigate('Account', { form: 'delete' })} />
        <BoxHeader title={settingTitles['logout']} mode='light' onPress={showLogoutConfirmDialog} />
      </View>

      <Text style={styles.sectionHeader}>Display settings</Text>
      <View style={{ ...Forms.roundedCon }}>
        <BoxHeader title={settingTitles['weight']} mode='light' onPress={() => setWeightUnit(prev => prev === 'kg' ? 'lb' : 'kg')}/>
        <Text style={[styles.unit, { top: 25 }]}>{weightUnit}</Text>
        <BoxHeader title={settingTitles['food']} mode='light' onPress={() => setFoodUnit(prev => prev === 'g' ? 'oz' : 'g')}/>
        <Text style={[styles.unit, { bottom: 35 }]}>{foodUnit}</Text>
  
      </View>
    
    </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  scrollViewContent: {
    ...Spacing.flexColumn,
    flexGrow: 1,
  },
  unit: { 
    position: 'absolute', 
    right: 50, 
  },
  sectionHeader: {
    ...Typography.xSmallHeader,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
})

export default SettingsScreen