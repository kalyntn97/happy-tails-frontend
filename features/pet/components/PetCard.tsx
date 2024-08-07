//npm modules
import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions } from "react-native"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
//types & utils
import { Pet } from "@pet/PetInterface"
import { getActionIconSource, getPetIconSource } from "@utils/ui"
//components
import { IconButton, MainButton, StatButton, TransparentButton } from "@components/ButtonComponent"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { countYearsBetween } from "@utils/datetime"
import { useCaresByPet, useHealthDueByPet } from "@hooks/sharedHooks"
import { SPECIES_OPTIONS } from "@pet/petHelpers"
import StatButtonList from "./StatButtonList"
interface PetCardProps {
  pet: Pet
  index: number
  scrollX: Animated.SharedValue<number>
  navigation: any
}

const PetCard: React.FC<PetCardProps> = ({ pet, index, scrollX, navigation }) => {
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
              <Image style={{ ...UI.smallIcon }} source={getPetIconSource(!SPECIES_OPTIONS.includes(pet.species) ? 'Others' : pet.species)} />
              <Text style={styles.body}>{pet.breed ? pet.breed : 'Unknown'}</Text>
            </View>

            <View style={styles.petInfo}>
              <Image style={{ ...UI.smallIcon }} source={require('@assets/icons/info-birthday.png')} />
              <Text style={styles.body}>
                {petAge} {petAge !== 'Unknown' && (petAge <= 1 ? 'year' : 'years')}
              </Text>
            </View>
          </View>
        </View>

        <Image style={styles.petPhoto } 
          source={pet.photo ? {uri: pet.photo} : getPetIconSource(['Dog', 'Cat'].includes(pet.species) ? `${pet.species}Profile` : 'AnimalProfile')} 
        />

        <StatButtonList petId={pet._id} petColor={pet.color} navigation={navigation} size="small" />

        <View style={styles.btnCon}>
          <TransparentButton title='Log' icon="logPet" onPress={() => navigation.navigate('CreateLog', { pet })} bgColor={Colors.multi.semiTransparent[pet.color]} bdColor={Colors.multi.transparent[pet.color]} />

          <TransparentButton title='Details' icon='detailsPet' onPress={() => navigation.navigate('Details', { petId: pet._id })} bgColor={Colors.multi.semiTransparent[pet.color]} bdColor={Colors.multi.transparent[pet.color]} />
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
    ...UI.cardWithShadow,
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
  petPhoto: {
    ...UI.photo,
    borderRadius: 100,
    backgroundColor: Colors.pink.light
  },
  btnCon: { 
    ...Spacing.flexRow, 
    marginTop: 10,
  }
})
 
export default PetCard