//npm modules
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert } from "react-native"
import { useIsFocused } from "@react-navigation/native"
//component
import { BoxHeader } from "@components/UIComponents"
//context
import { useDisplayUnits, useSetActions } from "@store/store"
import { useAuth } from "@auth/AuthContext"
//helpers
import { FOOD_UNITS, WEIGHT_UNITS } from "@stat/statHelpers"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'

interface AccountProps {
  navigation: any
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
  const { setDisplayUnits } = useSetActions()

  const { weight, food } = displayUnits
  const { onLogout } = useAuth()

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

  const displaySettings = [
    { key: 'weight', title: settingTitles['weight'], units: WEIGHT_UNITS,currentValue: weight, setValue: () => setDisplayUnits('weight', weight === WEIGHT_UNITS[0] ? WEIGHT_UNITS[1] : WEIGHT_UNITS[0])},
    { key: 'food', title: settingTitles['food'], units: FOOD_UNITS, currentValue: food, setValue: () => setDisplayUnits('food', food === FOOD_UNITS[0] ? FOOD_UNITS[1]: FOOD_UNITS[0]) },
  ]
  const accountSettings =[
    { key: 'update', title: settingTitles['update'], onPress: () => navigation.navigate('Account', { form: 'update' }) },
    { key: 'delete', title: settingTitles['delete'], onPress: () => navigation.navigate('Account', { form: 'delete' }) },
    { key: 'logout', title: settingTitles['logout'], onPress: () => showLogoutConfirmDialog() },
  ]
  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}> 
      <Text style={styles.sectionHeader}>Display settings</Text>
      <View style={{ ...UI.roundedCon }}>
        { displaySettings.map(setting =>
          <BoxHeader key={setting.key} title={setting.title} rightContent={ <Text>{setting.currentValue}</Text>} onPress={setting.setValue} mode='light' />
        )}
      </View>

      <Text style={styles.sectionHeader}>Account settings</Text>
      <View style={{ ...UI.roundedCon }}>
        { accountSettings.map(setting =>
          <BoxHeader key={setting.key} title={setting.title} onPress={setting.onPress} mode={ setting.key === 'delete' ? 'dark' : 'light'} titleColor={setting.key === 'delete' && Colors.red.darkest} />
        )}
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