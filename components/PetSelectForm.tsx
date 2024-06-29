import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PetInfo from './PetInfo/PetInfo'
import { Spacing } from '@styles/index'
import { PetBasic } from '@pet/PetInterface'
import { useShallowPets } from '@hooks/sharedHooks'

type Props = {
  mode?: 'multi',
  onSelect: (petIds: string[]) => void
  initials: string[]
}

const PetSelectForm = ({ mode, onSelect, initials }: Props) => {
  const { PET_BASICS } = useShallowPets()
  const [selected, setSelected] = useState<string[]>(initials ?? [])

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

export default PetSelectForm

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    width: '100%',
    flexWrap: 'wrap',
  },
  petBtn: {
    width: 80,
    height: 100,
  },
  selected: {
    opacity: 1
  },
  inactive: {
    opacity: 0.3  
  },
})