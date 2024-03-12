import { StyleSheet, View, Text } from "react-native"
import LottieView from "lottie-react-native"
import { Typography, Colors, Spacing } from "@styles/index"

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
    ...Spacing.flexColumn,
  },
  msg: {
    ...Typography.subHeader,
    color: Colors.darkPink,
    marginTop: 40
  },
  catAnimation: {
    width: 300,
    height: 300,
  },
})

export default PlaceHolder