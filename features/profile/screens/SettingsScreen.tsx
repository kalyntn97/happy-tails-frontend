import { useEffect, useRef } from "react"
import { Alert, SectionList, Text } from "react-native"
//component
import { FormHeader, FormLabel, TitleLabel } from "@components/UIComponents"
//context
import { useAuth } from "@auth/AuthContext"
import { useDisplayUnits, useSetActions } from "@store/store"
//helpers & utils
import { Profile } from "@profile/ProfileInterface"
import { StackScreenNavigationProp } from "@navigation/types"
import { FOOD_UNITS, WEIGHT_UNITS } from "@stat/statHelpers"
import { showToast } from "@utils/misc"
//styles
import { Colors, UI } from '@styles/index'
import { verticalScrollProps } from "@styles/ui"

interface AccountProps {
  navigation: StackScreenNavigationProp
  route: { params: { sectionIndex?: number, itemIndex?: number, sectionTitle?: string } }
  profile: Profile
}

export const settingTitles = {
  update: 'Update account information', 
  delete: 'Delete account and all pet profiles', 
  logout: 'Sign out of account', 
  weight: 'Change display unit: Weight', 
  food: 'Change display unit: Food', 
}

const SettingsScreen = ({ navigation, route, profile }: AccountProps) => {
  const listRef = useRef<SectionList>(null)

  const displayUnits = useDisplayUnits()
  const { setDisplayUnits } = useSetActions()
  const { weight, food } = displayUnits

  const { onLogout } = useAuth()

  const logout = async () => {
    const { status, error } = await onLogout!()
    showToast({ text1: status ?? error, style: error ? 'error' : 'success' })
  }

  const showLogoutConfirmDialog = () => {
    return Alert.alert(
      'Are you sure?',
      'Log out of your account?', 
      [
        { text: 'Yes', onPress: logout },
        { text: 'No' }
      ]
    )
  }

  const displaySettings = [
    { key: 'weight', title: settingTitles['weight'], 
      units: WEIGHT_UNITS, currentValue: weight, 
      setValue: () => setDisplayUnits('weight', weight === WEIGHT_UNITS[0] ? WEIGHT_UNITS[1] : WEIGHT_UNITS[0]) 
    },
    { key: 'food', title: settingTitles['food'], 
      units: FOOD_UNITS, currentValue: food, 
      setValue: () => setDisplayUnits('food', food === FOOD_UNITS[0] ? FOOD_UNITS[1]: FOOD_UNITS[0]) 
    },
  ]
  const accountSettings = [
    { key: 'update', title: settingTitles['update'], onPress: () => navigation.navigate('Account', { form: 'update' }) },
    { key: 'delete', title: settingTitles['delete'], onPress: () => navigation.navigate('Account', { form: 'delete' }) },
    { key: 'logout', title: settingTitles['logout'], onPress: () => showLogoutConfirmDialog() },
  ]

  const settingsData: { title: string, data: any[] }[] = [
    { title: 'Display Settings', data: displaySettings },
    { title: 'Account Settings', data: accountSettings },
  ]

  useEffect(() => {
    if (listRef.current && route.params) {
      const { sectionIndex = 0, itemIndex = 0, sectionTitle = 'Display Settings' } = route.params
      const validSectionIndex = sectionTitle ? settingsData.findIndex(section => section.title === sectionTitle) : sectionIndex
      listRef.current.scrollToLocation({ sectionIndex: validSectionIndex >= 0 ? validSectionIndex : sectionIndex, itemIndex: itemIndex })
    }
  }, [route.params])
  
  return (
    <SectionList
      ref={listRef}
      sections={settingsData}
      keyExtractor={item => item.key}
      ListHeaderComponent={<FormHeader title='Settings' />}
      renderSectionHeader={({ section: { title } }) => (
        <FormLabel label={title} containerStyles={{ marginTop: 15 }}/>
      )}
      contentContainerStyle={UI.form(15)}
      renderItem={({ item, index, section }) => {
        if (section.title === 'Display Settings') {
          return (
            <TitleLabel key={item.key} title={item.title} rightAction={<Text>{item.currentValue}</Text>} onPress={item.setValue} containerStyles={index !== section.data.length - 1 && UI.tableRow()} />
          )
        } else if (section.title === 'Account Settings') {
          return (
            <TitleLabel key={item.key} title={item.title} onPress={item.onPress} mode={item.key === 'delete' ? 'bold' : 'normal'} color={item.key === 'delete' && Colors.red.darkest} containerStyles={index !== section.data.length - 1 && UI.tableRow()} />
          )
        } else return null
      }}
      { ...verticalScrollProps }
    />
  )
}

export default SettingsScreen