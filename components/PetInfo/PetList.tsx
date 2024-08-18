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

const BaseList = ({ petArray, size }: PetListProps) => {
  const iconStyles = useMemo(() => (index: number) => {
    const baseStyle = { zIndex: index }
    const marginStyle = size === 'xSmall' || size === 'xxSmall' || size === 'tiny'
      ? { marginLeft: -15 }
      : { marginHorizontal: 10 }
    
    return { ...baseStyle, ...marginStyle }
  }, [size])

  return (
    <View style={Spacing.flexRow}>
      {petArray.map((pet: Pet | PetBasic, index: number) => 
        <View key={pet._id} style={iconStyles(index)}>
          <PetInfo pet={pet} size={size} key={pet.name} />
        </View>
      )}
    </View>
  )
}

const PetList = memo(({ petArray, size, containerStyles, type = 'wrap' }: PetListProps) => {
  const listStyles = useMemo(() => [type === 'wrap' ? { flexWrap: 'wrap' } : {}, containerStyles], [size])

  return (  
    <View style={listStyles as ViewStyle}>
      { type === 'scroll' ?
        <ScrollView horizontal>
          <BaseList petArray={petArray} size={size} />
        </ScrollView>
      : <BaseList petArray={petArray} size={size} /> }
    </View>
  )
})

export default PetList