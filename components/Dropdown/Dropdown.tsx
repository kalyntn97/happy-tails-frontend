//npm modules
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { DimensionValue, FlatList, Keyboard, Modal, Pressable, ScrollView, ScrollViewProps, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import Fuse from "fuse.js"
//helpers 
import * as careHelpers from '@care/careHelpers'
import * as healthHelpers from '@health/healthHelpers'
import * as petHelpers from '@pet/petHelpers'
//components
import { ErrorMessage, Icon } from "@components/UIComponents"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { lightPalette } from "@styles/ui"

interface DropdownProps {
  label?: string
  dataType?: string
  dataArray?: { _id: string, name: string, [key: string]: any }[]
  onSelect: (item: string | any ) => void
  width?: number | string
  initial?: string
  withSearch?: boolean
  searchLabel?: string
  error?: string
  buttonStyles?: ViewStyle
  contentStyles?: ViewStyle
  buttonTextStyles?: TextStyle
  contentPosition?: 'top' | 'bottom'
}

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

const scrollProps = { keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false } as ScrollViewProps

const Dropdown = memo(({ label, dataType, withSearch = false, dataArray, onSelect, width = '80%', initial, buttonStyles, contentStyles, buttonTextStyles, searchLabel, contentPosition = 'bottom', error }: DropdownProps) => {
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string>(initial ?? null)
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState<string>(initial ?? null)
  const [searchResults, setSearchResults] = useState([])
  
  //measure the btn pos and set the dropdown pos
  const DropdownBtn = useRef(null)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [dropdownLeft, setDropDownLeft] = useState(0)

  const openDropDown = (): void => {
    DropdownBtn.current.measure((fx, fy, w, h, px, py) => {
      setDropdownTop(withSearch? fy + h : py + h)
      setDropDownLeft(withSearch ? fx - 10 : buttonStyles ? px - 20 : fx) 
    })
    setVisible(true)
  }

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropDown()
  }
  
  const onItemPress = (item: string): void => {
    if (withSearch) {
      setSearchInput(item)
      setFocused(false)
      Keyboard.dismiss()
    } else {
      setSelected(item)
    }
    dataArray ? onSelect(dataArray.find(i => i.name === item)) : onSelect(item)
    setVisible(false)
  }


  const onSearch = (input: string) => {
    setSearchInput(input)
    const fuse = new Fuse(data)
    const search = fuse.search(input)
    if (!search.length) return setVisible(false)
    setSearchResults(search)
    openDropDown()
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = dataArray ? dataArray.map(item => item.name) : await typeToSource[dataType]()
      if (!ignore) setData(result)
    }
    let ignore = false
    fetchData()

    return () => {
      ignore = true
    }
  }, [dataType])

  const dropdownBtnStyles = useMemo(() => ([ 
    styles.dropDownBtn, 
    { width: '100%' }, 
    (focused || visible) && UI.focused,
    buttonStyles ?? UI.input(), 
  ]) as ViewStyle, [buttonStyles, focused, visible])

  const modalStyles = useMemo(() => ([ 
    styles.modalCon, 
    { width: '100%', left: dropdownLeft,  maxHeight: withSearch ? 200 : '50%' },
    contentPosition === 'bottom' ? { top: dropdownTop } : { bottom: dropdownTop },
    contentStyles,
  ]) as ViewStyle, [dropdownLeft, dropdownTop, contentPosition, contentStyles])

  return (
    <View style={{ width: width as DimensionValue, zIndex: focused ? 10 : 2 }}>
      { withSearch ?
        <View style={dropdownBtnStyles} ref={DropdownBtn}>
          <Icon name='search' size='xSmall' styles={{ marginRight: 15 }}/>
          <TextInput
            style={{ flex: 1 }}
            placeholder={label ?? 'enter search'}
            placeholderTextColor={UI.lightPalette().unfocused}
            value={searchInput}
            onChangeText={onSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={50}
            selectTextOnFocus={true}
          />
        </View>
      : 
        <TouchableOpacity style={dropdownBtnStyles} onPress={toggleDropdown} ref={DropdownBtn}>
          <Text style={[{ flex: 1  }, buttonTextStyles]}>{selected ?? label}</Text>
          <Icon name={visible ? 'up' : 'down'} styles={{ marginLeft: 15 }} />
        </TouchableOpacity>
      }
      { error && <ErrorMessage error={error} /> }

      { withSearch ?
        visible && 
          <View style={modalStyles}>
            <ScrollView style={Spacing.fullWH} {...scrollProps}>
              { searchResults.length > 1 ? searchResults.map(result =>
                <TouchableOpacity key={result.item} style={styles.itemCon} onPress={() => onItemPress(result.item)}>
                  <Text style={{ color: lightPalette().text }}>
                    { result.item }
                  </Text>
                </TouchableOpacity>
              )
              : <Text>No {searchLabel ?? 'item'} found.</Text> }
            </ScrollView>
          </View>
      : 
        <Modal visible={visible} transparent animationType="none">
          <Pressable style={UI.overlay} onPress={() => setVisible(false)}>
            <View style={modalStyles}>
              <FlatList 
                data={data} 
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.itemCon, item === selected && styles.itemConSelected]} onPress={() => onItemPress(item)}>
                    <Text style={item === selected ? Typography.focused : { color: lightPalette().text }}>
                      { item }
                    </Text>
                  </TouchableOpacity>
                )}
                {...scrollProps}
              /> 
            </View>
          </Pressable>
        </Modal> 
      }
    </View>
  )
})
 
const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    position: 'relative',
    marginVertical: 5,
  },
  modalCon: {
    ...UI.card(true, true),
    position: 'absolute',
    backgroundColor: Colors.white,
  },
  itemCon: {
    ...UI.rowContent('flex-start', 0, 10),
    ...UI.tableRow()
  },
  itemConSelected: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
})

export default Dropdown