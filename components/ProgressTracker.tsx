//npm
import { Image, ImageStyle, StyleSheet, View } from "react-native"
//styles
import { Spacing } from "../styles"

const ProgressTracker = ({ times, done }) => {
  const progressContainer = []
    for (let i = 0; i < done; i++) {
      progressContainer.push(
        <Image source={require('../assets/icons/heart-filled.png')} style={styles.heart as ImageStyle} key={`done-${i}`}/>
      )
    }
    for (let i = 0; i < times - done; i++) {
      progressContainer.push(
        <Image source={require('../assets/icons/heart-gray.png')} style={styles.heart as ImageStyle} key={`pending-${i}`} />
      )
    }

  return (  
    <View style={styles.progress}>
      {progressContainer}
    </View>
  )
}

const styles = StyleSheet.create({
  heart: {
    width: 40,
    height: 40,
    marginHorizontal: 2,
  }, 
  progress: {
    ...Spacing.flexRow
  },
})
 
export default ProgressTracker