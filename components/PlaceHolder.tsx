import { Colors, Spacing, Typography, UI } from "@styles/index"
import LottieView from "lottie-react-native"
import { StyleSheet, Text, View } from "react-native"
//components
import { TransparentButton } from "./ButtonComponents"

type Props = {
  type: 'pet' | 'care' | 'health' | 'ids' | 'services'
  petId?: string
  navigation: any
}

const map = {
  pet: { text: 'pet', subText: '' },
  care: { text: 'task', subText: '' },
  health: { text: 'vet visit', subText: '' },
  ids: { text: 'ID', subText: '' },
  services: { text: 'service', subText: '' },
}

const PlaceHolder = ({ type, petId, navigation }: Props) => {
  const color = UI.lightPalette().accent

  return (  
    <View style={Spacing.flexColumn}>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <TransparentButton title={`Add ${map[type].text}`} onPress={() => {
          type === 'pet' ? navigation.navigate('PetCreate') 
          : type === 'care' ? navigation.navigate('CareCreate')
          : type === 'health' ? navigation.navigate('HealthCreate')
          // : type === 'id' ? navigation.navigate('EditDetails', { form: type, petId })
          // : type === 'service' ? navigation.navigate('EditDetails', { form: type, petId })
          : navigation.navigate('PetEditDetails', { type, petId })
        }} color={color} bdColor={color} 
      />
      <Text style={styles.msg}>No {map[type].text}s found. {map[type].subText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  msg: {
    ...Typography.smallSubHeader,
  },
  catAnimation: {
    width: 300,
    height: 300,
  },
})

export default PlaceHolder