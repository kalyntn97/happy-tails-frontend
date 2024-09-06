import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { moderateScale } from 'react-native-size-matters'
//types & utils
import { Pet } from "@pet/PetInterface"
import { SPECIES } from "@pet/petHelpers"
import { countYearsBetween } from "@utils/datetime"
import { IconType, getPetIconSource } from "@utils/ui"
//components
import { MainButton } from "@components/ButtonComponents"
//styles
import { Icon } from "@components/UIComponents"
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { windowWidth } from "@utils/constants"
interface PetCardProps {
  pet: Pet
  index: number
  scrollX: Animated.SharedValue<number>
  navigation: any
}

const PetCard = ({ pet, index, scrollX, navigation }: PetCardProps) => {
  const petAge = pet.dob ? countYearsBetween(pet.dob, 'today') : 'Unknown'

  const { width } = useWindowDimensions()
  
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(
        scrollX.value,
        [(index - 1) * width, index * width, (index + 1) * width],
        [-width * 0.1, 0, width * 0.1],
        'clamp'
      ) },
      { scale: interpolate(
        scrollX.value,
        [(index - 1) * width, index * width, (index + 1) * width],
        [0.9, 1, 0.9],
        'clamp'
      ) },
    ],
  }))

  const infoMap = [
    { type: 'pet', icon: !SPECIES.includes(pet.species) ? 'Others' : pet.species, text: pet.breed ? pet.breed : 'Unknown' },
    { icon: 'birthdayColor', text: `${petAge} ${petAge !== 'Unknown' && (petAge <= 1 ? 'year' : 'years')}` },
  ]
  
  return ( 
    <Animated.View style={[Spacing.centered, animatedStyles, { width: width }]} key={pet._id}>
      <View style={[styles.base, { backgroundColor: Colors.multi.lightest[pet.color] }]}>
        <View style={Spacing.flexColumnStretch}>
          <Text style={styles.petName}>{pet.name}</Text>
          
          <View style={styles.detailsContainer}>
            { infoMap.map(info =>
              <View key={info.icon} style={Spacing.flexRow}>
                <Icon type={info.type as IconType} name={info.icon} />
                <Text style={styles.body}>{info.text}</Text>
              </View>
            )}
          </View>
        </View>

        <Image style={UI.photo('large')} 
          source={pet.photo ? {uri: pet.photo} : getPetIconSource(['Dog', 'Cat'].includes(pet.species) ? `${pet.species}Profile` : 'AnimalProfile')} 
        />

        {/* <StatButtonList petId={pet._id} petColor={pet.color} navigation={navigation} size="small" /> */}

        <View style={styles.btnCon}>
          <MainButton title='Log' icon="logPet" onPress={() => navigation.navigate('CreateStat', { pet })} bgColor={Colors.multi.semiTransparent[pet.color]} buttonStyles={styles.button} />
          <MainButton title='Details' icon='detailsPet' onPress={() => navigation.navigate('PetDetails', { petId: pet._id })} bgColor={Colors.multi.semiTransparent[pet.color]} buttonStyles={styles.button} />
        </View>  

      </View>

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  base: {
    ...UI.card(true, true),
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: windowWidth * 0.9,
    // transform: [{ scale: moderateScale(0.8, 1.5) }],
  },
  petName: {
    ...Typography.subHeader,
    margin: 0,
    padding: 10,
  },
  detailsContainer: {
    ...Spacing.flexRowStretch,
    justifyContent: 'space-between'
  },
  body: {
    ...Typography.regBody,
    marginHorizontal: 5,
  },
  btnCon: { 
    ...Spacing.flexRowStretch,
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    marginHorizontal: 15,
  }
})

export default PetCard