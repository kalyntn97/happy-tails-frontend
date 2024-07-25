//npm modules
import { ReactElement, useEffect, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList, Pressable, DimensionValue, ViewStyle } from "react-native"
//helpers 
import * as petHelpers from '@pet/petHelpers'
import * as careHelpers from '@care/careHelpers'
import * as healthHelpers from '@health/healthHelpers'
import { getActionIconSource } from "@utils/ui"
import { useShallowPets } from "@hooks/sharedHooks"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { lightPalette } from "@styles/ui"

interface DropdownProps {
  label?: string
  dataType?: string
  dataArray?: { _id: string, name: string, [key: string]: any }[]
  onSelect: (item: string | any ) => void
  width?: number | string
  initial?: string
  extraStyles?: ViewStyle
}

const Dropdown: React.FC<DropdownProps> = ({ label, dataType, dataArray, onSelect, width = '90%', initial, extraStyles }) => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string>(initial ?? null)

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropDown()
  }
  //measure the btn pos and set the dropdown pos
  const DropdownBtn = useRef(null)
  const [dropdownTop, setDropdownTop] = useState(0)
 
  const openDropDown = (): void => {
    DropdownBtn.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h)
    })
    setVisible(true)
  }
  
  const onItemPress = (item: string ): void => {
    setSelected(item)
    if (dataArray) {
      onSelect(dataArray.find(i => i.name === item))
    } else onSelect(item)
    setVisible(false)
  }

  //populate data
  useEffect(() => {
    const fetchData = async (dataType: string) => {
      const typeToSource = {
        'species': () => petHelpers.SPECIES_OPTIONS,
        'Dog': async () => await petHelpers.getDogBreedData(),
        'Cat': async () => await petHelpers.getCatBreedData(),
        'Bird': () => petHelpers.BIRD_SPECIES,
        'Fish': () => petHelpers.FISH_SPECIES,
        'frequency': () => careHelpers.CARE_FREQ,
        'care': () => Object.values(careHelpers.CARE_NAMES),
        'health': () => Object.values(healthHelpers.HEALTH_NAMES),
        'healthFrequency': () => healthHelpers.HEALTH_FREQ,
        'dogVaccines': () => healthHelpers.DOG_VACCINE_NAMES,
        'catVaccines': () => healthHelpers.CAT_VACCINE_NAMES,
        'petStatus': () => petHelpers.STATUS,
        'petIds': () => petHelpers.IDS,
        'medStatus': () => petHelpers.MED_STATUS,
        'illnessTypes': () => petHelpers.DISEASE_TYPES,
        'illnessStatus': () => petHelpers.DISEASE_STATUS,
        'serviceTypes': () => petHelpers.SERVICE_TYPES,
      }
      const result = dataArray ? dataArray.map(item => item.name) : typeToSource[dataType]()
      setData(result)
    }
    fetchData(dataType)
    setSelected(initial)
  }, [dataType, initial])

  return (
    <TouchableOpacity style={[styles.dropDownBtn, { width: width as DimensionValue }, visible && UI.inputFocused]} onPress={toggleDropdown} ref={DropdownBtn}>
      {visible && (
        <Modal visible={visible} transparent animationType="none">
          <Pressable style={UI.overlay} onPress={() => setVisible(false)}>
            <View style={[styles.content, extraStyles, { top: dropdownTop, width: width as DimensionValue, maxHeight: '50%' }]}>
              <FlatList 
                data={data} 
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.itemCon, item === selected && styles.itemConSelected]} onPress={() => onItemPress(item)}>
                    <Text style={item === selected ? Typography.focused : { color: lightPalette.text }}>
                      { item }
                    </Text>
                  </TouchableOpacity>
                )} 
              />
            </View>
          </Pressable>
        </Modal>
      )}
      <Text style={{ maxWidth: '80%' }}>{selected ?? label}</Text>
      <Image source={getActionIconSource(visible ? 'up' : 'down')} style={styles.icon} />
    </TouchableOpacity>
  )
}
 
const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    justifyContent: 'space-between',
    marginVertical: 5,
    zIndex: 1,
    ...UI.input,
  },
  icon: {
    width: 20,
    height: 20,
  },
  content: {
    position: 'absolute',
    ...UI.cardWithShadow,
  },
  itemCon: {
    paddingVertical: 10,
    borderColor: lightPalette.border,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  itemConSelected: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
})

export default Dropdown