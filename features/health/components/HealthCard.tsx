//npm
import { FC } from 'react'
import { Image, Text, View } from 'react-native'
//types & utils
import { Health } from '@health/HealthInterface'
import { HEALTHS, VACCINES } from '@health/healthHelpers'
import { useShallowPets } from '@hooks/sharedHooks'
import { getActionIconSource, getHealthIconSource } from '@utils/ui'
//components
import { CloseButton, TransparentButton } from '@components/ButtonComponents'
import PetInfo from '@components/PetInfo/PetInfo'
//styles
import { Colors, UI, Spacing } from "@styles/index"
import { styles } from '@styles/stylesheets/ModalCardStyles'
import { Icon } from '@components/UIComponents'

interface HealthCardProps {
  health: Health
  onNavigate: () => void
  navigation: any
  activeDateObj: Date
}

const HealthCard: FC<HealthCardProps> = ({ health, navigation, onNavigate, activeDateObj }) => {
  const iconSource = getHealthIconSource(health.name)

  const { petIdToColor } = useShallowPets()
  const petColor = Colors.multi.lightest[petIdToColor(health.pet._id) ?? health.pet.color]
  const pastDue = new Date(health.nextDue.date) < new Date()
  
  const done = health.lastDone.some(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth())
  const doneDate = done && health.lastDone.find(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth()).date
  //? handle when latest visit is not in the same month
  const lastDoneDate = health.lastDone.length > 0 && health.lastDone[0].date

  const handleNavigate = () => {
    onNavigate && onNavigate()
    navigation.navigate('HealthDetails', { healthId: health._id })
  }

  return (
    <View style={[styles.container, { backgroundColor: petColor }]}>
      <CloseButton onPress={() => onNavigate()} />
      <View style={styles.header}>
        <Image source={iconSource} style={styles.icon } />
        <Text style={styles.title}>
          { HEALTHS[health.name] ?? health.name }
        </Text>   
      </View>

      { health.name === 'vax' && 
        <View style={styles.desCon}>
          <Text style={styles.des}>{VACCINES[health.vaccine].name}</Text>
        </View>
      }

      <View style={styles.subHeader}>
        <View style={{ width: 80, height: 100 }}>
          <PetInfo pet={health.pet} size='small' />
        </View>
        <View style={Spacing.flexRow}>
          <Icon name='repeat' />
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