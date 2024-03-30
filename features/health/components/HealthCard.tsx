//npm
import { FC } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
//types & utils
import { Health } from '@health/HealthInterface'
import { getIconSource } from '@utils/ui'
import { VACCINES } from '@health/healthHelpers'
//components
import PetInfo from '@components/PetInfo/PetInfo'
//styles
import { styles } from '@styles/ModalCardStyles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '@styles/colors'

interface HealthCardProps {
  health: Health
  onNavigate: () => void
  navigation: any
  activeDateObj: Date
}

const HealthCard: FC<HealthCardProps> = ({ health, navigation, onNavigate, activeDateObj }) => {
  const iconSource = getIconSource(health.name)
  const pastDue = new Date(health.nextDue) < new Date()
  const done = health.lastDone.some(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth())
  const doneDate = done && health.lastDone.find(visit => new Date(visit.date).getMonth() === activeDateObj.getMonth()).date
  //handle when latest visit is not in the same month
  const lastDoneDate = health.lastDone.length > 0 && new Date(health.lastDone[0].date)

  const handleNavigate = () => {
    onNavigate && onNavigate()
    navigation.navigate('Health', { screen: 'Details' , params : { health }, initial: false })
  }

  return (
    <View style={[styles.container, { height: 430, marginTop: 'auto' }]}>
      <View style={styles.header}>
        <View style={[
          styles.colorBox,
          { backgroundColor: Colors.green }
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
      
      <View style={styles.body}>
        {done && 
          <Text style={styles.bodyText}>Completed on {new Date(doneDate).toDateString()}</Text>
        }
        {!done && lastDoneDate && 
          <Text style={styles.bodyText}>Completed on {new Date(lastDoneDate).toDateString()}</Text>
        }
        <Text style={[styles.status,  { color: pastDue ? Colors.red : Colors.green }]}>
          {pastDue ? 'Past due!' : 'Due on'}
        </Text>
        <Text style={styles.title}>{new Date(health.nextDue).toDateString()}</Text>
        
        <Text style={styles.subTitle}>Previous visits</Text>
        <View style={styles.rowCon}>
          {health.lastDone.map(visit => 
            <Text key={visit._id} style={styles.bodyText}>{new Date(visit.date).toLocaleDateString()}</Text>  
          )}
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={handleNavigate}>
          <Text style={styles.btnText}>View History</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  )
}

export default HealthCard