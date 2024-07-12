import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
//hooks
import { useCaresByPet, useHealthDueByPet } from '@hooks/sharedHooks'
//components
import { StatButton } from '@components/ButtonComponent'
//styles
import { Colors, Spacing } from '@styles/index'

type Props = {
  petId: string
  petColor: number
  size?: string
  navigation?: any
}

const StatButtonList = ({ petId, petColor, size, navigation }: Props) => {
  const caresDueToday = useCaresByPet(petId)
  const healthDue = useHealthDueByPet(petId)
 
  const stats = [
    { header: 'vet visit', stat: healthDue?.minDays ?? -1, body: 'days', onPress: () => {
        if (healthDue?.minDays) return navigation.navigate('HealthDetails', { healthId: healthDue?.healthId })
        return 
      }, active:!!healthDue?.minDays
    },
    { header: 'task', stat: caresDueToday.length, body: 'today', onPress: () => navigation.navigate('CareIndex', { sectionIndex: 0, itemIndex: 0 }), active: caresDueToday.length > 0 },
    { header: 'log', iconUri: require('@assets/icons/stat-mood-4.png'), body: new Date().toLocaleDateString() },
  ]
  return (
    <View style={styles.container}>
      { stats.map(stat => <StatButton key={stat.header} disabled={!stat.active} header={stat.header} stat={stat.stat} body={stat.body} iconUri={stat.iconUri} bgColor={Colors.multi.light[petColor]} size={size} onPress={stat.onPress} />) }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    width: '100%',
    justifyContent: 'space-evenly',
    marginVertical: 15,
  }
})

export default StatButtonList