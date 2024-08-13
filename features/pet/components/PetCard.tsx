import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { moderateScale } from 'react-native-size-matters'
//types & utils
import { Pet } from "@pet/PetInterface"
import { SPECIES_OPTIONS } from "@pet/petHelpers"
import { countYearsBetween } from "@utils/datetime"
import { getPetIconSource } from "@utils/ui"
//components
import { TransparentButton } from "@components/ButtonComponents"
import StatButtonList from "./StatButtonList"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { Icon } from "@components/UIComponents"
interface PetCardProps {
  pet: Pet
  index: number
  scrollX: Animated.SharedValue<number>
  navigation: any
}

const PetCard = ({ pet, index, scrollX, navigation }: PetCardProps) => {
  const petAge = pet.dob ? countYearsBetween(pet.dob, 'today') : 'Unknown'

  const { width } = useWindowDimensions()
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [-width * 0.1, 0, width * 0.1],
          'clamp'
        )},
        { scale: interpolate(
          scrollX.value,
          [(index - 1) * width, index * width, (index + 1) * width],
          [0.9, 1, 0.9],
          'clamp'
        )},
      ],
    }
  })
  
  return ( 
    <Animated.View style={[styles.container, animatedStyles, { width: width }]} key={pet._id}>
      <View style={[styles.base, { backgroundColor: Colors.multi.lightest[pet.color] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.petInfo}>
              <Icon type='pet' name={!SPECIES_OPTIONS.includes(pet.species) ? 'Others' : pet.species} />
              <Text style={styles.body}>{pet.breed ? pet.breed : 'Unknown'}</Text>
            </View>

            <View style={styles.petInfo}>
              <Icon name='birthdayColor' />
              <Text style={styles.body}>
                {petAge} {petAge !== 'Unknown' && (petAge <= 1 ? 'year' : 'years')}
              </Text>
            </View>
          </View>
        </View>

        <Image style={UI.photo('large')} 
          source={pet.photo ? {uri: pet.photo} : getPetIconSource(['Dog', 'Cat'].includes(pet.species) ? `${pet.species}Profile` : 'AnimalProfile')} 
        />

        <StatButtonList petId={pet._id} petColor={pet.color} navigation={navigation} size="small" />

        <View style={styles.btnCon}>
          <TransparentButton title='Log' icon="logPet" onPress={() => navigation.navigate('CreateLog', { pet })} bgColor={Colors.multi.semiTransparent[pet.color]} bdColor={Colors.multi.transparent[pet.color]} />

          <TransparentButton title='Details' icon='detailsPet' onPress={() => navigation.navigate('PetDetails', { petId: pet._id })} bgColor={Colors.multi.semiTransparent[pet.color]} bdColor={Colors.multi.transparent[pet.color]} />
        </View>  

      </View>

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.centered,
  },
  base: {
    ...UI.card(),
    justifyContent: 'flex-start',
    alignItems: 'center',
    transform: [{ scale: moderateScale(0.8, 1.5) }],
  },
  headerContainer: {
    ...Spacing.flexColumn,
    width: '100%',
  },
  petName: {
    ...Typography.smallHeader,
    margin: 0,
    padding: 10,
  },
  detailsContainer: {
    ...Spacing.flexRow,
    width: '100%',
    justifyContent: 'space-between'
  },
  petInfo: {
    ...Spacing.flexRow,
  },
  body: {
    ...Typography.smallBody,
    marginHorizontal: 5,
  },
  btnCon: { 
    ...Spacing.flexRow, 
    marginTop: 10,
  }
})

export default PetCard