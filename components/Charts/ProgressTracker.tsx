//npm
import { Image, ImageStyle, StyleSheet, View } from "react-native"
//styles
import { Spacing } from "@styles/index"

const ProgressTracker = ({ times, done, size }) => {
  const progressContainer = []
    for (let i = 0; i < done; i++) {
      progressContainer.push(
        <Image 
          key={`done-${i}`}
          source={require('@assets/icons/heart-filled.png')} 
          style={[
            styles.heart ,
            size === 'small' 
            ? { width: 40, height: 40 } 
            : size === 'xSmall' 
              ? { width: 25, height: 25 } 
              : { width: 60, height: 60 }
          ]} 
        />
      )
    }
    for (let i = 0; i < times - done; i++) {
      progressContainer.push(
        <Image 
          key={`pending-${i}`} 
          source={require('@assets/icons/heart-gray.png')} 
          style={[
            styles.heart ,
            size === 'small' 
            ? { width: 40, height: 40 } 
            : size === 'xSmall' 
              ? { width: 25, height: 25 } 
              : { width: 60, height: 60 }
          ]} 
        />
      )
    }

  return (  
    <View style={[
      styles.progress,
      { maxWidth: size === 'large' ? 200 : 140}
    ]}>
      {progressContainer}
    </View>
  )
}

const styles = StyleSheet.create({
  heart: {
    marginHorizontal: 2,
  }, 
  progress: {
    ...Spacing.flexRow,
    flexWrap: 'wrap',
  },
})
 
export default ProgressTracker