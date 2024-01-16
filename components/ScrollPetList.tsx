//npm
import { ScrollView, View, StyleSheet } from "react-native"
import { Pet } from "../services/petService"
//component
import PetInfo from "./PetInfo"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface ScrollPetListProps {
  petArray: Pet[]
  size: 'compact' | 'expanded' | 'small'
  horizontal: boolean
}

const ScrollPetList = ({ petArray, size }) => {
  return (  
    <ScrollView style={styles.scrollView}>
      <View style={styles.petList}>
        {petArray.map((pet: Pet, idx: number) => 
          <View style={size === 'small' ? { width: 60, height: 100 } : { width: 90, height: 120 }} key={idx}>
            <PetInfo pet={pet} size={size} key={pet._id} />
          </View>  
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%'
  },
  petList: {
    ...Spacing.flexRow,
    width: '100%',
    flexWrap: 'wrap',
  },
})
 
export default ScrollPetList