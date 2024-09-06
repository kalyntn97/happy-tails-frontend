//npm
import { Pet, PetBasic } from "@pet/PetInterface"
import { memo, useMemo } from "react"
import { DimensionValue, ScrollView, StyleSheet, View, ViewStyle } from "react-native"
//component
import PetInfo from "./PetInfo"
//styles
import { Spacing } from '@styles/index'
import { Size } from "@styles/ui"
import { ScrollHeader } from "@components/UIComponents"

interface PetListProps {
  petArray: Pet[] | PetBasic[]
  size: Size
  containerStyles?: ViewStyle
  type?: 'scroll' | 'wrap'
  width?: DimensionValue
}

const renderPetList = (petArray: Pet[] | PetBasic[], size: Size) => {
  const iconStyles = useMemo(() => (index: number) => {
    const baseStyle = { zIndex: index }
    const marginStyle = size === 'xSmall' || size === 'xxSmall' || size === 'tiny'
      ? { marginLeft: -15 }
      : { marginHorizontal: 10 }
    
    return { ...baseStyle, ...marginStyle }
  }, [size])

  return (
    petArray.map((pet: Pet | PetBasic, index: number) => 
    <View key={pet._id} style={iconStyles(index)}>
      <PetInfo pet={pet} size={size} key={pet.name} />
    </View>
  )
)}

const PetList = memo(({ petArray, size, containerStyles, type = 'wrap', width = 'fit-content' as DimensionValue }: PetListProps) => {
  const listStyles = useMemo(() => [Spacing.flexRow, type === 'wrap' ? { flexWrap: 'wrap' } : {}, { width: width }, containerStyles], [type, size, width])

  return (  
    <View style={listStyles as ViewStyle}>
      { type === 'scroll' ?
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
          { renderPetList(petArray, size) }
        </ScrollView>
      : renderPetList(petArray, size) }
    </View>
  )
})

export default PetList