import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
//components
import { FormHeader } from '@components/UIComponents'
import PetInfo from '@components/PetInfo/PetInfo'
//utils
import { useShallowPets } from '@hooks/sharedHooks'
import { PetBasic } from '@pet/PetInterface'
//styles
import { Buttons, Spacing } from '@styles/index'

type Props = {
  mode?: 'multi',
  onSelect: (petIds: string[]) => void
  selected: string[]
}

const PetPicker = ({ mode, onSelect, selected }: Props) => {
  const { PET_BASICS } = useShallowPets()
  
  const handleSelect = (petId: string) => {
    let petArray = []
    if (mode === 'multi') {
      if (selected.includes(petId)) {
        petArray = selected.length > 1 ? selected.filter(s => s !== petId) : selected
      } else petArray = [...selected, petId] 
    } else petArray = [petId]
    onSelect(petArray)
  }

  return (
    <View>
      <FormHeader title={`Select Pet${mode === 'multi' && 's'}`} size='large'/>
      <View style={styles.container}>
        { PET_BASICS.map((pet: PetBasic) =>
          <Pressable key={pet._id} style={[styles.petBtn, selected.includes(pet._id) ? styles.selected : styles.inactive]} onPress={() => handleSelect(pet._id)}>
            <PetInfo pet={pet} size='small' />
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    flexWrap: 'wrap',
  },
  petBtn: {
    maxWidth: '30%',
    ...Buttons.squareBase,
  },
  selected: {
    opacity: 1
  },
  inactive: {
    opacity: 0.3  
  },
})

export default PetPicker
