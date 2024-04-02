//npm
import { StyleSheet, Text, View, Image } from "react-native"
//types & helpers
import * as careHelpers from "@care/careHelpers"
import { getDateInfo } from "@utils/datetime"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface YearChartProps {
  tracker: any
  times: number
}

const YearChart: React.FC<YearChartProps> = ({ tracker, times }) => {
  const { isCurrent } = careHelpers.getTrackerInfo(tracker.name)
  const { year: currYear } = getDateInfo(new Date())
  const done = tracker.done[0]
  const size = times > 6 ? 'small' : 'large'

  const progressContainer = []
    for (let i = 0; i < done; i++) {
      progressContainer.push(
        <Image 
          key={`done-${i}`}
          source={require('@assets/icons/heart-filled.png')} 
          style={[styles.heart , { width: 40, height: 40 }]} 
        />
      )
    }
    for (let i = 0; i < times - done; i++) {
      progressContainer.push(
        <Image 
          key={`pending-${i}`} 
          source={require('@assets/icons/heart-gray.png')} 
          style={[styles.heart , { width: 40, height: 40 }]} 
        />
      )
    }

  return (  
    <View style={styles.container}>
      <Text style={[styles.header,isCurrent ? { color: Colors.darkPink } : {}]}>{currYear}</Text>
    
      <View style={[ styles.progress, { maxWidth: size === 'large' ? 200 : 140} ]}>
        {progressContainer}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    ...Spacing.flexRow,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    ...Forms.boxShadow
  },
  header: {
    fontSize: 35,
    fontWeight: 'bold',
    width: '20%',
    marginRight: 'auto'
  },
  heart: {
    marginHorizontal: 2,
  }, 
  progress: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
  },
})

export default YearChart