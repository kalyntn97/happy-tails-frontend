//npm modules
import { ReactElement, useEffect, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//store & hooks
import { usePetStore, usePets } from "@pet/PetStore"
//helpers 
import * as petHelpers from '@pet/petHelpers'
import * as careHelpers from '@care/careHelpers'
import * as healthUtils from '@health/healthHelpers'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface DropdownProps {
  label: string
  dataType: string
  onSelect: (item: string ) => void
  width?: number
}

const Dropdown: React.FC<DropdownProps> = ({ label, dataType, onSelect, width }) => {
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

  const pets = usePets()

  const petNames = () => {
    const names = pets.map(pet => pet.name)
    return names
  }
  
  //populate data
  useEffect(() => {
    const fetchData = async (dataType: string) => {
      let result: string[]
      switch (dataType) {
        case 'species': result = petHelpers.speciesData; break
        case 'dogBreed': result = await petHelpers.getDogBreedData(); break
        case 'catBreed': result = await petHelpers.getCatBreedData(); break
        case 'birdSpecies': result = await petHelpers.getBirdSpeciesData(); break
        case 'fishSpecies': result = petHelpers.petFishData; break
        case 'frequency': result = careHelpers.frequencyData; break
        case 'care': result = careHelpers.careData; break
        case 'health': result = healthUtils.healthData; break
        case 'petNames': result = petNames; break
        case 'healthFrequency': result = healthUtils.healthFrequency; break
        case 'healthTypes': result = healthUtils.healthTypes; break
        case 'dogVaccines': result = healthUtils.dogVaccines; break
        case 'catVaccines': result = healthUtils.catVaccines; break
        default: result = []
      }
      setData(result)
    }
    fetchData(dataType)
  }, [])

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
      <Image source={require('@assets/icons/dropdown.png')} style={styles.icon} />
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
    maxWidth: 180,
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