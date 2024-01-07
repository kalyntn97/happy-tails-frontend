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
        {petArray.map((pet, idx) => 
          <View style={size === 'small' ? { width: 60, height: 100 } : { width: 90, height: 120 }}>
            <PetInfo pet={pet} size={size} key={idx} />
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