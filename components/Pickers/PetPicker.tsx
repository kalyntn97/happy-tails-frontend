import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PetInfo from '@components/PetInfo/PetInfo'
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
  const [selected, setSelected] = useState<string[]>(initials)

  const handleSelect = (petId: string) => {
    if (mode === 'multi') {
      let petArray = []
      setSelected(prev => {
        if (prev.length > 1) {
          petArray = prev.includes(petId) ? prev.filter(s => s !== petId) : [...prev, petId]
        } else petArray = prev
        return petArray
      })
      onSelect(petArray)
    } else {
      setSelected([petId])
      onSelect([petId])
    }
  }
  
  useEffect(() => {
    setSelected(initials)
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

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    ...Spacing.centered,
    width: '100%',
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
