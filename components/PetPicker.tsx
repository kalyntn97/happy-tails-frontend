import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PetInfo from './PetInfo/PetInfo'
import { Colors, Spacing } from '@styles/index'
import { PetBasic } from '@pet/PetInterface'
import { useShallowPets } from '@hooks/sharedHooks'
import { Buttons } from '@styles/index'

type Props = {
  mode?: 'multi',
  onSelect: (petIds: string[]) => void
  initials: string[]
}

const PetPicker = ({ mode, onSelect, initials }: Props) => {
  const { PET_BASICS } = useShallowPets()
  const initialSelections = initials.length > 0 ? initials : [PET_BASICS[0]._id]
  const [selected, setSelected] = useState<string[]>(initialSelections)

  const handleSelect = (petId: string) => {
    if (mode === 'multi') {
      setSelected(prev => {
        const selected = prev.includes(petId) ? prev.filter(s => s !== petId) : [...prev, petId]
        onSelect(selected)
        return selected
      })
    } else {
      setSelected(() => {
        onSelect([petId])
        return [petId]
      })
    }
  }
  
  useEffect(() => {
    setSelected(initialSelections)
  }, [initials])

  return (
    <View style={styles.container}>
      {PET_BASICS.map((pet: PetBasic) =>
        <Pressable key={pet._id} style={[styles.petBtn, selected.includes(pet._id) ? styles.selected : styles.inactive]} onPress={() => handleSelect(pet._id)}>
          <PetInfo pet={pet} size='small' />
        </Pressable>
      )}
    </View>
  )
}

export default PetPicker

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    width: '100%',
    flexWrap: 'wrap',
    ...Spacing.centered,
  },
  petBtn: {
    width: 100,
    height: 110,
    borderWidth: 1,
    borderRadius: 8,
    ...Spacing.centered,
    borderColor: Colors.shadow.dark,
  },
  selected: {
    opacity: 1
  },
  inactive: {
    opacity: 0.3  
  },
})