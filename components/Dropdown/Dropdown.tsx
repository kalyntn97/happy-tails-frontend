//npm modules
import { ReactElement, useEffect, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//store & hooks
import { usePetNames } from "@store/storeUtils"
//helpers 
import * as petHelpers from '@pet/petHelpers'
import * as careHelpers from '@care/careHelpers'
import * as healthHelpers from '@health/healthHelpers'
import { getActionIconSource } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface DropdownProps {
  label: string
  dataType: string
  onSelect: (item: string ) => void
  width?: number
  initial?: string
}

const Dropdown: React.FC<DropdownProps> = ({ label, dataType, onSelect, width, initial }) => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string>(initial ?? null)
  const PET_NAMES = usePetNames()

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
    onSelect(item)
    setSelected(item)
    setVisible(false)
  }

  //populate data
  useEffect(() => {
    const fetchData = async (dataType: string) => {
      const typeToSource = {
        'petNames': PET_NAMES,
        'species': petHelpers.SPECIES,
        'dogBreed': await petHelpers.getDogBreedData(),
        'catBreed': await petHelpers.getCatBreedData(),
        'birdSpecies': await petHelpers.getBirdSpeciesData(),
        'fishSpecies': petHelpers.FISH_SPECIES,
        'frequency': careHelpers.CARE_FREQ,
        'care': Object.values(careHelpers.CARE_NAMES),
        'health': Object.values(healthHelpers.HEALTH_NAMES),
        'healthFrequency': healthHelpers.HEALTH_FREQ,
        'healthTypes': healthHelpers.HEALTH_TYPES,
        'dogVaccines': healthHelpers.DOG_VACCINE_NAMES,
        'catVaccines': healthHelpers.CAT_VACCINE_NAMES,
        'petStatus': petHelpers.STATUS,
      }
      const result = typeToSource[dataType] || []
      setData(result)
      setSelected(initial ?? null)
    }
    fetchData(dataType)
  }, [dataType])

  return (
    <TouchableOpacity style={[styles.dropDownBtn, width && { width: width }]} onPress={toggleDropdown} ref={DropdownBtn}>
      {visible && (
        <Modal visible={visible} transparent animationType="none">
          <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
            <View style={[styles.content, { top: dropdownTop }]}>
              <FlatList 
                data={data} 
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
                    <Text style={item === selected && styles.selected}>
                      { item }
                    </Text>
                  </TouchableOpacity>
                )} 
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <Text style={styles.label}>{selected ?? label}</Text>
      <Image source={getActionIconSource('downThin')} style={styles.icon} />
    </TouchableOpacity>
  )
}
 
const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    ...Forms.input,
    borderColor: Colors.pink.reg,
    justifyContent: 'space-between',
    zIndex: 1
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 10
  },
  overlay: {
    ...Spacing.fullWH,
    alignItems: 'center'
  },
  content: {
    position: 'absolute',
    backgroundColor: Colors.pink.lightest,
    width: 250,
    height: 200,
    padding: 10,
    ...Forms.boxShadow
  },
  label: {
    maxWidth: 180,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1
  },
  selected: {
    color: Colors.pink.dark,
    fontWeight: 'bold'
  }
})

export default Dropdown