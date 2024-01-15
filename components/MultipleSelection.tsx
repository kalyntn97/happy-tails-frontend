import { useState, useEffect, useRef } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//context
import { usePetContext } from "../context/PetContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

interface MultipleSelectionProps {
  label: string | string[]
  dataType: 'petNames'
  onSelect: (items: string[]) => void
}

const MultipleSelection: React.FC<MultipleSelectionProps> = ({ label, dataType, onSelect }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])

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
  
  const onItemPress = (item: string ) => {
    // use callback func with setState to handle asynchronous calls
    setSelected((prev) => {
      const selected = prev.some(p => p === item) ? prev.filter(p => p !== item) : [...prev, item]
      onSelect(selected)
      setVisible(false)
      return selected
    })
  }

  // get data for select pets
  const { pets } = usePetContext()
  const getPetNames = (): string[] => {
    return pets.map(pet => pet.name)
  }

  //populate data
  useEffect(() => {
    const fetchData = async (dataType: string) => {
      let result: string[]
      if (dataType === 'petNames') {
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
                      <Text style={selected.some(s => s === item) ? styles.selected : {}}>
                        { item || label }
                      </Text>
                  </TouchableOpacity>
                )} 
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    {selected.length
    ? <View style={styles.labelField}>
        {selected.map((item, idx) =>
          <Text key={idx} style={styles.label}>{item}</Text>
        )}
      </View>
    : <Text>{label}</Text>
    }
    <Image source={require('../assets/icons/dropdown.png')} style={styles.icon as ImageStyle} />
  </TouchableOpacity>
  )

  
}

const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    ...Forms.input,
    height: 'auto',
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
    marginVertical: 5
  },
  labelField: {
    flexDirection: 'column'
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

export default MultipleSelection