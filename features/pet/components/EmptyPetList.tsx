import LottieView from 'lottie-react-native'
import { StyleSheet, Text, View } from 'react-native'
//components
import { MainButton, TransparentButton } from '@components/ButtonComponents'
import { Colors, Spacing, Typography } from '@styles/index'

const EmptyPetList = ({ navigation }) => {
  return (
    <View style={Spacing.flexColumn}>
      <Text style={{ ...Typography.subHeader, color: Colors.shadow.darkest }}>No pets added.</Text>
      <MainButton title='Create a Pet' onPress={() => navigation.navigate('Create')} color={Colors.white} bgColor={Colors.pink.dark} />
      <Text style={styles.subHeader}>Start from scratch. Unlimited number of pets.</Text>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <TransparentButton title='Add an Existing Pet' color={Colors.pink.darkest} bdColor={Colors.pink.darkest} top={-50} />
      <Text style={styles.subHeader}>Use a code to add from an existing household, created by a family member or friend.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  catAnimation: {
    width: 400,
    height: 400,
    marginTop: -50,
  },
  subHeader: {
    ...Typography.smallBody,
    color: Colors.shadow.darkest,
    margin: 10,
  },
})

export default EmptyPetList
