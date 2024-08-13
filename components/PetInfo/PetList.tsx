//npm
import { ScrollView, View, StyleSheet, Pressable } from "react-native"
import { Pet, PetBasic } from "@pet/PetInterface"
//component
import PetInfo from "./PetInfo"
//styles
import { Spacing } from '@styles/index'
import { Size } from "@styles/ui"

interface PetListProps {
  petArray: Pet[] | PetBasic[]
  size: Size
}

const PetList = ({ petArray, size }: PetListProps) => {
  return (  
    <View style={[styles.container, 
      size === 'xSmall' ? { maxWidth: 225, height: 40 } 
      : size === 'small' ? { maxWidth: 300 } 
      : { width: '100%' }
    ]}>
      {petArray.map((pet: Pet | PetBasic, idx: number) => 
        <PetInfo pet={pet} size={size} key={pet.name} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
})

export default PetList