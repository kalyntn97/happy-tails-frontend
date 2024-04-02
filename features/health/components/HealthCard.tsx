//npm
import { FC } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
//types & utils
import { Health } from '@health/HealthInterface'
import { getIconSource } from '@utils/ui'
import { useShallowPetColor } from '@home/hooks'
//components
import PetInfo from '@components/PetInfo/PetInfo'
import { TransparentButton } from '@components/ButtonComponent'
//styles
import { styles } from '@styles/ModalCardStyles'
import { Colors, Typography, Forms } from "@styles/index"

interface HealthCardProps {
  health: Health
  onNavigate: () => void
  navigation: any
  activeDateObj: Date
}

const HealthCard: FC<HealthCardProps> = ({ health, navigation, onNavigate, activeDateObj }) => {
  const iconSource = getIconSource(health.name)
  const { petIdToColor } = useShallowPetColor()
  const petColor = Colors.multiArray3[petIdToColor(health.pet._id) ?? health.pet.color]

  const pastDue = new Date(health.nextDue.date) < new Date()
  const done = health.lastDone.some(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth())
  const doneDate = done && health.lastDone.find(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth()).date
  //handle when latest visit is not in the same month
  const lastDoneDate = health.lastDone.length > 0 && new Date(health.lastDone[0].date)

  const handleNavigate = () => {
    onNavigate && onNavigate()
    navigation.navigate('Health', { screen: 'Details' , params : { healthId: health._id }, initial: false })
  }

  return (
    <View style={[styles.container, { height: 430, marginTop: 'auto' }]}>
      <View style={styles.header}>
        <View style={[
          styles.colorBox,
          { backgroundColor: petColor }
        ]}>
          <View style={styles.titleContainer}>
            <Image source={iconSource} style={styles.icon } />
            <View style={styles.columnCon}>
              <Text style={styles.title}>
                {health.vaccine && 
                  <Text>{health.vaccine} </Text>
                }
                {health.name}
              </Text>            
              <Text style={styles.freq}>Every {health.times} {health.frequency}</Text>
            </View>
          </View>
        </View>

        <PetInfo pet={health.pet} size='small' />
        
      </View>
      
      <View style={[styles.body, { marginTop: -50 }]}>
        {done && 
          <Text style={styles.bodyText}>Completed on {new Date(doneDate).toDateString()}</Text>
        }
        {!done && lastDoneDate && 
          <Text style={styles.bodyText}>Completed on {new Date(lastDoneDate).toDateString()}</Text>
        }
        <Text style={styles.subTitle}>
          {pastDue ? 'Past due!' : 'Due on'}
        </Text>
        <Text style={[styles.title, { color: pastDue ? Colors.red : Colors.green }]}>{new Date(health.nextDue.date).toDateString()}</Text>
        
        <Text style={styles.subTitle}>Latest Visit</Text>
          
        <TransparentButton title='See more' onPress={handleNavigate} top={15} bottom={0} size='small' />
    
      </View>
    </View>
  )
}

export default HealthCard