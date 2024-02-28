//npm
import { ScrollView, View, StyleSheet } from "react-native"
import { Pet } from "@pet/PetInterface"
//component
import PetInfo from "./PetInfo"
//styles
import { Spacing } from '@styles/index'

interface ScrollPetListProps {
  petArray: Pet[]
  size: 'compact' | 'small' | 'mini' // small < compact
}

const ScrollPetList: React.FC<ScrollPetListProps> = ({ petArray, size }) => {
  return (  
    <View style={
      size === 'mini' ? { maxWidth: 225, height: 45 } 
      : size === 'small' ? { maxWidth: 300, height: 100 } 
      : { maxWidth: 450, height: 240 }
    }>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
      >
        {petArray.map((pet: Pet, idx: number) => 
          <View 
            key={idx}
            style={
              size === 'mini' ? { width: 40, height: 40 } 
              : size === 'small' ? { width: 60, height: 100 } 
              : { width: 90, height: 120 }
            } 
          >
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