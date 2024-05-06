//npm modules
import { ReactElement, useEffect, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//store & hooks
import { usePetNames } from "@store/storeUtils"
//helpers 
import * as petHelpers from '@pet/petHelpers'
import * as careHelpers from '@care/careHelpers'
import * as healthHelpers from '@health/healthHelpers'
import * as statHelpers from '@stat/statHelpers'
import { getActionIconSource } from "@utils/ui"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface DropdownProps {
  label?: string
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
  const [dropdownLeft, setDropdownLeft] = useState(0)
 
  const openDropDown = (): void => {
    DropdownBtn.current.measure((_fx, _fy, _w, h, px, py) => {
      setDropdownTop(py + h)
      setDropdownLeft(px)
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
        'species': petHelpers.SPECIES_OPTIONS,
        'Dog': await petHelpers.getDogBreedData(),
        'Cat': await petHelpers.getCatBreedData(),
        'Bird': await petHelpers.getBirdSpeciesData(),
        'Fish': petHelpers.FISH_SPECIES,
        'frequency': careHelpers.CARE_FREQ,
        'care': Object.values(careHelpers.CARE_NAMES),
        'health': Object.values(healthHelpers.HEALTH_NAMES),
        'healthFrequency': healthHelpers.HEALTH_FREQ,
        'healthTypes': healthHelpers.HEALTH_TYPES,
        'dogVaccines': healthHelpers.DOG_VACCINE_NAMES,
        'catVaccines': healthHelpers.CAT_VACCINE_NAMES,
        'petStatus': petHelpers.STATUS,
        'petIds': petHelpers.IDS,
        'medStatus': petHelpers.MED_STATUS,
        'diseaseTypes': petHelpers.DISEASE_TYPES,
        'diseaseStatus': petHelpers.DISEASE_STATUS,
        'serviceTypes': petHelpers.SERVICE_TYPES,
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
            <View style={[styles.content, data.length > 4 && { height: 200 }, width && { width: width }, { top: dropdownTop, left: dropdownLeft }]}>
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
    marginVertical: 5,
    zIndex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  overlay: {
    ...Spacing.fullWH,
    alignItems: 'center'
  },
  content: {
    position: 'absolute',
    backgroundColor: Colors.white,
    padding: 10,
    ...Forms.boxShadow,
    borderRadius: 8,
    width: 300,
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