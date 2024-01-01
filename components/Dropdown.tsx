//npm modules
import { ReactElement, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'
//utils
import * as petUtils from '../utils/petUtils'

interface DropdownProps {
  label: string,
  dataType: 'breed' | 'species',
  onSelect: (item: { label: string, value: string }) => void
}

const Dropdown: React.FC<DropdownProps> = ({ label, dataType, onSelect }) => {
  const [visible, setVisible] = useState(false)

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
  
  const onItemPress = (item: { label: string, value: string }): void => {
    onSelect(item)
    setVisible(false)
  }
  //populate data
  let data: { label: string, value: string }[]

  if (dataType === 'species') {
    data = petUtils.speciesData
    
  } else if (dataType === 'breed') {
    
  }
 
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
                      { (item && item.label) || label }
                    </Text>
                  </TouchableOpacity>
                )} 
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <Text style={styles.label}>{label}</Text>
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