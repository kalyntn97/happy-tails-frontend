import { StyleSheet, View, Text } from "react-native"
import LottieView from "lottie-react-native"
import { Typography, Colors, Spacing } from "@styles/index"
import { TransparentButton } from "./ButtonComponent"

const PlaceHolder = ({ type, navigation }) => {
  return (  
    <View style={styles.container}>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <TransparentButton title={`Add ${type}`} onPress={() => {
          type === 'task' ? navigation.navigate('Care', { screen: 'Create' })
          : type === 'vet appointments' ? navigation.navigate('Health', { screen: 'Create' })
          : type === 'pet' ? navigation.navigate('Pets', { screen: 'Create' })
          : null
        }} color={Colors.pink.dark} bdColor={Colors.pink.dark} top={-40}
      />
      <Text style={styles.msg}>No {type}s.</Text>
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
    width: 300,
    height: 300,
  },
})

export default PlaceHolder