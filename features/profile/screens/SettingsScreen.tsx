//npm modules
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//component
import { BoxHeader } from "@components/HeaderComponent"
//context
import { useDisplayUnits, useSetActions } from "@store/store"
import { useAuth } from "@auth/AuthContext"
//helpers
import { FOOD_UNITS, WEIGHT_UNITS } from "@stat/statHelpers"
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
  const displayUnits = useDisplayUnits()
  const { weight, food } = displayUnits
  const { setDisplayUnits } = useSetActions()
  const { onLogout, onDeleteAccount } = useAuth()

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
        { text: 'Yes', onPress: () => { logout() }},
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
        <BoxHeader title={settingTitles['weight']} mode='light' 
          onPress={() => setDisplayUnits({ ...displayUnits, weight: weight === WEIGHT_UNITS[0] ? WEIGHT_UNITS[1] : WEIGHT_UNITS[0] })} 
          rightContent={ <Text>{weight}</Text> } 
        />
        <BoxHeader title={settingTitles['food']} mode='light' 
          onPress={() => setDisplayUnits({ ...displayUnits, food: food === FOOD_UNITS[0] ? FOOD_UNITS[1]: FOOD_UNITS[0] })} 
          rightContent={ <Text>{food}</Text> }
        />
        
  
      </View>
    
    </ScrollView>
  )
}
 
const styles = StyleSheet.create({
  scrollViewContent: {
    ...Spacing.flexColumn,
    flexGrow: 1,
  },
  sectionHeader: {
    ...Typography.xSmallHeader,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
})

export default SettingsScreen