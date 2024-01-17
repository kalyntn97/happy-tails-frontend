//npm
import { ScrollView, View, StyleSheet } from "react-native"
import { Pet } from "../services/petService"
//component
import PetInfo from "./PetInfo"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface ScrollPetListProps {
  petArray: Pet[]
  size: 'compact' | 'small' // small < compact
  horizontal: boolean
}

const ScrollPetList = ({ petArray, size }) => {
  return (  
    <View style={size === 'small' ? { maxWidth: 300, height: 100 } : { maxWidth: 450, height: 240 }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
      >
          {petArray.map((pet: Pet, idx: number) => 
            <View style={size === 'small' ? { width: 60, height: 100 } : { width: 90, height: 120 }} key={idx}>
              <PetInfo pet={pet} size={size} key={pet._id} />
            </View>  
          )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    ...Spacing.flexRow,
    width: '100%',
    flexWrap: 'wrap',
  },
})
 
export default ScrollPetList