//npm modules
import { ReactElement, useEffect, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
//utils 
import * as petUtils from '../utils/petUtils'
import * as careUtils from '../utils/careUtils'

interface DropdownProps {
  label: string
  dataType: 'fishSpecies' | 'birdSpecies' | 'catBreed' | 'dogBreed' | 'species' | 'frequency' | 'care'
  onSelect: (item: string ) => void
}

const Dropdown: React.FC<DropdownProps> = ({ label, dataType, onSelect }) => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string>(
    label !== 'Select Species' || 'Select Breed' ? label : ''
  )

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
      let result: string[]
      if (dataType === 'species') {
        result = petUtils.speciesData
      } else if (dataType === 'dogBreed') {
        result = await petUtils.getDogBreedData()
      } else if (dataType === 'catBreed') {
        result = await petUtils.getCatBreedData()
      } else if (dataType === 'birdSpecies') {
        result = await petUtils.getBirdSpeciesData()
      } else if (dataType === 'fishSpecies') {
        result = petUtils.petFishData
      } else if (dataType === 'frequency') {
        result = careUtils.frequencyData
      } else if (dataType === 'care') {
        result = careUtils.careData
      } else if (dataType === 'petNames') {
        result = getPetNames()
      }
      setData(result)
    }
    fetchData(dataType)
  }, [])

  return (
    <TouchableOpacity style={styles.dropDownBtn} onPress={toggleDropdown} ref={DropdownBtn}>
      {visible && (
        <Modal visible={visible} transparent animationType="none">
          <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
            <View style={[styles.content, { top: dropdownTop }]}>
              <FlatList 
                data={data} 
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
                    <Text style={item === selected ? styles.selected : {}}>
                      { item || label }
                    </Text>
                  </TouchableOpacity>
                )} 
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <Text style={styles.label}>{selected ? selected : label}</Text>
      <Image source={require('../assets/icons/dropdown.png')} style={styles.icon} />
    </TouchableOpacity>
  )
}
 
const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    ...Forms.input,
    borderColor: Colors.pink,
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
    backgroundColor: Colors.lightestPink,
    width: 250,
    height: 200,
    padding: 10,
    ...Forms.boxShadow
  },
  label: {
    
  },
  item: {
    padding: 10,
    borderBottomWidth: 1
  },
  selected: {
    color: Colors.darkPink,
    fontWeight: 'bold'
  }
})

export default Dropdown