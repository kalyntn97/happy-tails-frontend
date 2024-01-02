//npm modules
import { ReactElement, useEffect, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
//utils
import * as petUtils from '../utils/petUtils'

interface DropdownProps {
  label: string,
  dataType: 'dogBreed' | 'species',
  onSelect: (item: string ) => void
}

const Dropdown: React.FC<DropdownProps> = ({ label, dataType, onSelect }) => {
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropDown()
  }
  //measure the btn pos and set the dropdown pos
  const DropdownBtn = useRef()
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
        }
        setData(result)
        console.log(result, data)
      
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
                    <Text style={styles.btnText}>
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
    alignItems: 'center',
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
  btnText: {

  }
})

export default Dropdown