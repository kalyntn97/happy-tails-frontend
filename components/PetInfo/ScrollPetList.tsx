//npm
import { ScrollView, View, StyleSheet, Pressable } from "react-native"
import { Pet, PetBasic } from "@pet/PetInterface"
//component
import PetInfo from "./PetInfo"
//styles
import { Spacing } from '@styles/index'

interface ScrollPetListProps {
  petArray: Pet[] | PetBasic[]
  size: 'compact' | 'small' | 'mini' // small < compact
  navigation?: any
}

const ScrollPetList: React.FC<ScrollPetListProps> = ({ petArray, size, navigation }) => {
  return (  
    <View style={
      size === 'mini' ? { maxWidth: 225, height: 50 } 
      : size === 'small' ? { maxWidth: 300, height: 110 } 
      : { maxWidth: 450, height: 250 }
    }>
      <ScrollView
        alwaysBounceVertical={false}
        contentContainerStyle={[
          styles.scrollContent,
          size === 'compact' && { paddingVertical: 10}
        ]}>
        {petArray.map((pet: Pet, idx: number) => 
          <View 
            key={idx}
            style={
              size === 'mini' ? { width: 40, height: 40 } 
              : size === 'small' ? { width: 60, height: 100 } 
              : { width: 90, height: 120 }
            } 
          >
            {/* <Pressable onPress={() => navigation.navigate('Pets', { screen: 'Details', params: { pet: pet } })}> */}
              <PetInfo pet={pet} size={size} key={pet._id} />
            {/* </Pressable> */}
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