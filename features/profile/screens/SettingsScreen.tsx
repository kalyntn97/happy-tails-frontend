//npm modules
import { Alert, StyleSheet, Text, View } from "react-native"
//component
import { ScrollScreen, TitleLabel } from "@components/UIComponents"
//context
import { useAuth } from "@auth/AuthContext"
import { useDisplayUnits, useSetActions } from "@store/store"
//helpers
import { FOOD_UNITS, WEIGHT_UNITS } from "@stat/statHelpers"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'

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
    <ScrollScreen> 
      <Text style={styles.sectionHeader}>Display settings</Text>
      <View style={{ ...UI.card() }}>
        { displaySettings.map(setting =>
          <TitleLabel key={setting.key} title={setting.title} rightAction={<Text>{setting.currentValue}</Text>} onPress={setting.setValue} mode='light' />
        )}
      </View>

      <Text style={styles.sectionHeader}>Account settings</Text>
      <View style={{ ...UI.card() }}>
        { accountSettings.map(setting =>
          <TitleLabel key={setting.key} title={setting.title} onPress={setting.onPress} mode={setting.key === 'delete' ? 'dark' : 'light'} color={setting.key === 'delete' && Colors.red.darkest} />
        )}
      </View>

    </ScrollScreen>
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