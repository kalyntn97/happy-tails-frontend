import { StyleSheet, View, Text } from "react-native"
import LottieView from "lottie-react-native"
import { Typography, Colors, Spacing } from "@styles/index"
import { TransparentButton } from "./ButtonComponents"
import { useNavigation } from "@react-navigation/native"

type Props = {
  type: 'task' | 'vet' | 'ids' | 'services'
  petId?: string
  navigation: any
}

const PlaceHolder = ({ type, petId, navigation }: Props) => {
  const map = {
    task: { text: 'task', subText: '' },
    vet: { text: 'vet visit', subText: '' },
    ids: { text: 'ID', subText: '' },
    services: { text: 'service', subText: '' },
  }

  return (  
    <View style={styles.container}>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <TransparentButton title={`Add ${map[type].text}`} onPress={() => {
          type === 'task' ? navigation.navigate('CareCreate')
          : type === 'vet' ? navigation.navigate('HealthCreate')
          // : type === 'id' ? navigation.navigate('EditDetails', { form: type, petId })
          // : type === 'service' ? navigation.navigate('EditDetails', { form: type, petId })
          : navigation.navigate('PetEditDetails', { type, petId })
        }} color={Colors.pink.dark} bdColor={Colors.pink.dark} top={-40}
      />
      <Text style={styles.msg}>No {map[type].text}s found. {map[type].subText}</Text>
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