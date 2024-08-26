import React, { memo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
//components
import PetInfo from '@components/PetInfo/PetInfo'
import PetList from '@components/PetInfo/PetList'
import { FormHeader, ModalInput } from '@components/UIComponents'
import { CustomToast } from '@navigation/NavigationStyles'
//utils
import { useShallowPets } from '@hooks/sharedHooks'
import { PetBasic } from '@pet/PetInterface'
import { showRequireSelectionToast } from '@utils/misc'
//styles
import { Buttons, Spacing } from '@styles/index'

type Props = {
  mode: 'multi' | 'single',
  onSelect: (petIds: string[]) => void
  pets: string[] | PetBasic[]
  placeholder?: string
}

const PetPicker = memo(({ placeholder = 'No pet selected', pets, mode = 'single', onSelect }: Props) => {
  const { PET_BASICS, petIdToPet } = useShallowPets()

  const petMapped: PetBasic[] = pets.map(pet => pet.name ? pet : petIdToPet(pet))
    
  const handleSelect = (petId: string) => {
    let petArray = []
    if (mode === 'multi') {
      if (petMapped.some(p => p._id === petId)) {
        if (petMapped.length > 1) petArray = petMapped.filter(s => s._id !== petId)
        else {
          petArray = petMapped
          showRequireSelectionToast()
        }
        petArray = petMapped.length > 1 ? petMapped.filter(s => s._id !== petId) : petMapped
      } else petArray = [...pets, petId] 
    } else petArray = [petId]
    onSelect(petArray)
  }

  return (
    
    <ModalInput buttonStyles={{ ...Spacing.flexRow }} customLabel={
      pets.length ? <PetList petArray={petMapped} size='xSmall' /> : <Text>{placeholder}</Text>
    }>
      <FormHeader title={`Select Pet${mode === 'multi' ? 's' : ''}`} size='large'/>
      <View style={styles.container}>
        { PET_BASICS.map((pet: PetBasic) =>
          <Pressable key={pet._id} style={[styles.petBtn, petMapped.some(p => p._id === pet._id) ? styles.selected : styles.inactive]} onPress={() => handleSelect(pet._id)}>
            <PetInfo pet={pet} size='small' />
          </Pressable>
        )}
      </View>
      <CustomToast />
    </ModalInput>
  )
})

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
