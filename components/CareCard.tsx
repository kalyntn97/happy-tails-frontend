//npm
import { View, StyleSheet, Text, Image, ImageStyle, ScrollView } from "react-native"
//types
import { Pet } from "../services/petService"
import { Care } from "../services/careService"
//utils & services
import { getIconSource } from "../utils/careUtils"
//components
import PetInfo from "./PetInfo"
import ScrollPetList from "./ScrollPetList"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'


interface CareCardProps {
  care: Care
}

export const care = {
  name: 'Teeth Brushing',
  pets: [
    {name: 'Luna Stella Reyes-Nguyen', age: 3, breed: 'Ragdoll', species: 'Cat', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500003/happy-tails/zl1mn2rhuqa1x5keabda.jpg'},
    {name: 'Levi Milo Reyes-Nguyen', age: 3, breed: 'British Shorthair', species: 'Cat', photo: 'https://res.cloudinary.com/davz8l292/image/upload/v1704500133/happy-tails/vce2esffuxeqtxhsvcnt.jpg'},
  ],
  times: 3,
  frequency: 'weekly',
  tracker: []
}

const CareCard = () => {

  const iconSource = getIconSource(care.name)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.colorBox}>
          <View style={styles.titleContainer}>
            <Image source={iconSource} style={styles.icon as ImageStyle} />
            <Text style={styles.title}>{care.name}</Text>
          </View>
        </View>
        {/* <ScrollView>
          <View style={styles.petList}>
            {care.pets.map(pet => 
              <View style={styles.petInfo}>
                <PetInfo pet={pet} size='small' />
              </View>
            )}
          </View>
        </ScrollView> */}
        <View style={styles.petList}>
          <ScrollPetList petArray={care.pets} size='small' />
        </View>
      </View>
      
      <View style={styles.body}>
        <Text>This is body</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    backgroundColor: Colors.lightPink,
    ...Forms.card
  },
  header: {
    width: '100%',
    height: '60%',
    ...Spacing.flexColumn,
  },
  colorBox: {
    height: 70,
    width: '80%',
    backgroundColor: Colors.yellow,
    borderWidth: 3,
    borderColor: 'white',
  },
  titleContainer: {
    height: 70,
    width: '100%',
    ...Spacing.flexRow,
    alignItems: 'center',
  },
  petlist: {
    height: 90,
    width: '100%',
    ...Spacing.centered
  },
  title: {
    ...Typography.smallHeader,
  
  },
  icon: {
    ...Forms.icon
  },
  body: {
    width: '100%',
    height: '60%'
  },
})
 
export default CareCard