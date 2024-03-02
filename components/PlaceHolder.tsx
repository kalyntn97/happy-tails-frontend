import { StyleSheet, View, Text } from "react-native"
import LottieView from "lottie-react-native"
import { Typography, Colors } from "@styles/index"

const PlaceHolder = () => {
  return (  
    <View style={styles.empty}>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <Text style={styles.msg}>Start managing your pet's health</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  empty: {

  },
  msg: {
    ...Typography.subHeader,
    color: Colors.darkPink,
    marginTop: 50
  },
  catAnimation: {
    width: '100%'
  },
})

export default PlaceHolder