//npm modules
import { StyleSheet, Text, View, Image, TouchableOpacity, useWindowDimensions } from "react-native"
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated"
//types & utils
import { Pet } from "@pet/PetInterface"
import { getPetIconSource } from "@utils/ui"
//components
import { MainButton } from "@components/ButtonComponent"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'
interface PetCardProps {
  pet: Pet
  index: number
  scrollX: Animated.SharedValue<number>
  navigation: any
}

const PetCard: React.FC<PetCardProps> = ({ pet, index, scrollX, navigation }) => {
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

  const iconSource = getPetIconSource(pet.species)
  
  return ( 
    <Animated.View style={[styles.container, animatedStyles, { width: width }]} key={pet._id}>
      <View style={styles.base}>
        <View style={styles.headerContainer}>
          <Text style={styles.petName}>{pet.name}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.petInfo}>
              <Image style={{ ...Forms.icon }} source={iconSource} />
              <Text style={styles.body}>{pet.breed ? pet.breed : 'Unknown'}</Text>
            </View>

            <View style={styles.petInfo}>
              <Image style={{ ...Forms.smallIcon }} source={require('@assets/icons/birthday.png')} />
              <Text style={styles.body}>
                {pet.age ? pet.age : 'Unknown'} {pet.age && (pet.age <= 1 ? 'year' : 'years')}
              </Text>
            </View>
          </View>
        </View>

        <Image 
          source={pet.photo ? {uri: pet.photo} : require('@assets/icons/pet-profile.png')} 
          style={styles.petPhoto } 
        />
        
      <MainButton title='Details' onPress={() => navigation.navigate('Details', { pet})} top='auto' bottom={20} bgColor={Colors.multiArray3[pet.color]} size='small' />
      </View>

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.centered,
    height: '100%'
  },
  base: {
    ...Forms.cardWithShadow,
    width: '90%',
    height: '90%',
    justifyContent: 'flex-start',
    backgroundColor: '#FBFFFE',
    alignItems: 'center',
  },
  headerContainer: {
    ...Spacing.flexColumn,
    width: '100%',
  },
  petName: {
    ...Typography.subHeader,
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
    ...Forms.photo,
    borderRadius: 100,
    backgroundColor: Colors.lightPink
  },
})
 
export default PetCard