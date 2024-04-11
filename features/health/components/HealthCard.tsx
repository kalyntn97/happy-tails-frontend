//npm
import { FC } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
//types & utils
import { Health } from '@health/HealthInterface'
import { getActionIconSource, getHealthIconSource } from '@utils/ui'
import { useShallowPetColor } from '@home/hooks'
import { HEALTHS } from '@health/healthHelpers'
//components
import PetInfo from '@components/PetInfo/PetInfo'
import { CloseButton, TransparentButton } from '@components/ButtonComponent'
//styles
import { styles } from '@styles/ModalCardStyles'
import { Colors, Spacing, Typography, Forms } from "@styles/index"

interface HealthCardProps {
  health: Health
  onNavigate: () => void
  navigation: any
  activeDateObj: Date
}

const HealthCard: FC<HealthCardProps> = ({ health, navigation, onNavigate, activeDateObj }) => {
  const iconSource = getHealthIconSource(health.name)

  const petIdToColor = useShallowPetColor()
  const petColor = Colors.multi.lightest[petIdToColor(health.pet._id) ?? health.pet.color]
  const pastDue = new Date(health.nextDue.date) < new Date()
  const lastDoneReversed = [...health.lastDone].reverse()
  const done = lastDoneReversed.some(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth())
  const doneDate = done && lastDoneReversed.find(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth()).date
  //? handle when latest visit is not in the same month
  const lastDoneDate = lastDoneReversed.length > 0 && new Date(lastDoneReversed[0].date)

  const handleNavigate = () => {
    onNavigate && onNavigate()
    navigation.navigate('Health', { screen: 'Details' , params : { healthId: health._id }, initial: false })
  }

  return (
    <View style={[styles.container, { backgroundColor: petColor }]}>
      <CloseButton onPress={() => onNavigate()} size='small' position="topRight" />
      <View style={styles.header}>
        <Image source={iconSource} style={styles.icon } />
        <Text style={styles.title}>
          { health.vaccine && health.vaccine }
          { HEALTHS[health.name] ?? health.name }
        </Text>            
      </View>

      <View style={styles.subHeader}>
        <View style={{ width: 80, height: 100 }}>
          <PetInfo pet={health.pet} size='small' />
        </View>
        <View style={{ ...Spacing.flexRow }}>
          <Image source={getActionIconSource('repeat')} style={{ ...Forms.smallIcon }} />
          <Text style={styles.freq}>Every {health.times} {health.frequency}</Text>
        </View>
      </View>

        <Text style={{ marginTop: 30, fontSize: 17 }}>Appointment on {done ? new Date(doneDate).toDateString() : lastDoneDate && new Date(lastDoneDate).toDateString()}</Text>

      <View style={styles.dateCon}>
        <Text style={styles.subTitle}>
          {pastDue ? 'Past due' : 'Due on'}: 
          <Text style={[styles.title, { color: pastDue ? Colors.red.reg : Colors.green.reg }]}> {new Date(health.nextDue.date).toDateString()}</Text>
        </Text>
        
        <Text style={styles.subTitle}>Latest Visit:
          <Text style={styles.bodyText}> {lastDoneDate ? new Date(lastDoneDate).toDateString() : 'No prior visits'}</Text>
        </Text>
      </View>
      
      <TransparentButton title='See more' onPress={handleNavigate} size='small' top='auto' color={Colors.shadow.darkest} />
    
    </View>
  )
}

export default HealthCard