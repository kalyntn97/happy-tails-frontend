import { StyleSheet, View, Text } from "react-native"
import LottieView from "lottie-react-native"
import { Typography, Colors, Spacing } from "@styles/index"
import { TransparentButton } from "./ButtonComponent"

const PlaceHolder = ({ navigation }) => {
  return (  
    <View style={styles.container}>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <TransparentButton title='Add task' onPress={() => navigation.navigate('Care', { screen: 'Create' })} color={Colors.pink.dark} />
      <Text style={styles.msg}>No tasks.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexColumn,
  },
  msg: {
    ...Typography.xSmallSubHeader,
    margin: 0,
  },
  catAnimation: {
    width: 200,
    height: 200,
  },
})

export default PlaceHolder