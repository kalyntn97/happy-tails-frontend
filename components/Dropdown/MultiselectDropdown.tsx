import { useState, useEffect, useRef } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native"
//store
import { usePetNames } from "@store/storeUtils"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '@styles/index'

interface MultiselectDropdownProps {
  label: string | string[]
  dataType: 'petNames'
  onSelect: (items: string[]) => void
  initials?: string[]
  width?: number
}

const MultiselectDropdown: React.FC<MultiselectDropdownProps> = ({ label, dataType, onSelect, initials, width }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>(initials ? initials : [])
  const petNames = usePetNames()

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
  
  const onItemPress = (item: string) => {
    // use callback func with setState to handle asynchronous calls
    setSelected((prev) => {
      const selected = prev.some(p => p === item) ? prev.filter(p => p !== item) : [...prev, item]
      onSelect(selected)
      setVisible(false)
      return selected
    })
  }

  //populate data
  useEffect(() => {
    const fetchData = async (dataType: string) => {
      let result: string[]
      if (dataType === 'petNames') {
        result = petNames
      }
      setData(result)
    }
    fetchData(dataType)
  }, [petNames])

  return (  
    <TouchableOpacity style={[styles.dropDownBtn, width && { width: width }]} onPress={toggleDropdown} ref={DropdownBtn}>
      {visible && (
        <Modal visible={visible} transparent animationType="none">
          <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
            <View style={[styles.content, { top: dropdownTop, width: width ?? 250 }]}>
              <FlatList 
                data={data} 
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
                      <Text style={selected.some(s => s === item) ? styles.selected : {}}>
                        { item }
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
          <Text key={idx} style={styles.label}>{ item ?? label}</Text>
        )}
      </View>
    : <Text>{label}</Text>
    }
    <Image source={require('@assets/icons/action-down_thin.png')} style={styles.icon } />
  </TouchableOpacity>
  )

  
}

const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    ...Forms.input,
    height: 'auto',
    borderColor: Colors.pink.reg,
    justifyContent: 'space-between',
    zIndex: 1,
    margin: 5,
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
    color: Colors.pink.dark,
    fontWeight: 'bold'
  }
})

export default MultiselectDropdown