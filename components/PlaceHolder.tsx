import { Colors, Spacing, Typography, UI } from "@styles/index"
import LottieView from "lottie-react-native"
import { StyleSheet, Text, View } from "react-native"
//components
import { TransparentButton } from "./ButtonComponents"
import { DetailType } from "@pet/PetInterface"
import { useNavigation } from "@react-navigation/native"

type Props = {
  type: 'pet' | 'care' | 'health' | DetailType
  petId?: string
}

const map = {
  pet: { text: 'pet', subText: '' },
  care: { text: 'task', subText: '' },
  health: { text: 'vet visit', subText: '' },
  ids: { text: 'ID', subText: '' },
  services: { text: 'service', subText: '' },
}

const PlaceHolder = ({ type, petId }: Props) => {
  const navigation = useNavigation()
  const color = UI.lightPalette().accent

  return (  
    <View style={Spacing.flexColumn}>
      <LottieView source={require('@assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
      <TransparentButton title={`Add ${map[type].text}`} onPress={() => {
          type === 'pet' ? navigation.navigate('PetCreate') 
          : type === 'care' ? navigation.navigate('CareCreate')
          : type === 'health' ? navigation.navigate('HealthCreate')
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