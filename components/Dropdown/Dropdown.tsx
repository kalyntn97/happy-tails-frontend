//npm modules
import { ReactElement, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { View, Image, ImageStyle, Modal, StyleSheet, Text, TouchableOpacity, FlatList, Pressable, DimensionValue, ViewStyle, TextInput, ScrollView, Keyboard } from "react-native"
//helpers 
import * as petHelpers from '@pet/petHelpers'
import * as careHelpers from '@care/careHelpers'
import * as healthHelpers from '@health/healthHelpers'
import { getActionIconSource } from "@utils/ui"
import { useShallowPets } from "@hooks/sharedHooks"
//styles
import { Buttons, Spacing, UI, Typography, Colors } from '@styles/index'
import { lightPalette } from "@styles/ui"
import Fuse, { FuseResult } from "fuse.js"
import { ErrorMessage, Icon } from "@components/UIComponents"

interface DropdownProps {
  label?: string
  dataType?: string
  dataArray?: { _id: string, name: string, [key: string]: any }[]
  onSelect: (item: string | any ) => void
  width?: number | string
  initial?: string
  extraStyles?: ViewStyle
  withSearch?: boolean
  searchLabel?: string
  error?: string
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

const Dropdown = memo(({ label, dataType, dataArray, onSelect, width = 'fit-content', initial, extraStyles, withSearch = false, searchLabel, error }: DropdownProps) => {
  const [data, setData] = useState<string[]>([])
  const [selected, setSelected] = useState<string>(initial ?? null)
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const [searchInput, setSearchInput] = useState<string>(null)
  const [searchResults, setSearchResults] = useState([])
  
  //measure the btn pos and set the dropdown pos
  const DropdownBtn = useRef(null)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [dropdownLeft, setDropDownLeft] = useState(0)

  const openDropDown = (): void => {
    DropdownBtn.current.measure((fx, fy, _w, h, px, py) => {
      setDropdownTop(withSearch? fy + h : py + h)
      setDropDownLeft(withSearch ? fx - 10 : px - fx - 10) 
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

  return (
    <View style={{ width: width as DimensionValue, zIndex: focused ? 10 : 2 }}>
      { withSearch ?
        <View style={[styles.dropDownBtn, focused && UI.inputFocused]} ref={DropdownBtn}>
          <TextInput
            style={{ maxWidth: '80%' }}
            placeholder='enter search'
            placeholderTextColor={UI.lightPalette.unfocused}
            value={searchInput}
            onChangeText={onSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={50}
            selectTextOnFocus={true}
          />
          <Icon iconSource={getActionIconSource('search')} size='xSmall' />
        </View>
        : <TouchableOpacity style={[styles.dropDownBtn, { width: width as DimensionValue }, visible && UI.inputFocused]} onPress={toggleDropdown} ref={DropdownBtn}>
          <Text style={{ maxWidth: '80%' }}>{selected ?? label}</Text>
          <Icon iconSource={getActionIconSource(visible ? 'up' : 'down')} size='xSmall' />
        </TouchableOpacity>
      }
      { error && <ErrorMessage error={error} /> }

      { withSearch ?
        visible && <View style={[styles.content, extraStyles, { top: dropdownTop, left: dropdownLeft, width: width as DimensionValue, maxHeight: 200 }]}>
          <ScrollView style={Spacing.fullWH}>
            { searchResults.length > 1 ? searchResults.map((result, idx) =>
              <TouchableOpacity key={result.item} style={styles.itemCon} onPress={() => onItemPress(result.item)}>
                <Text style={{ color: lightPalette.text }}>
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
            <View style={[styles.content, extraStyles, { top: dropdownTop, left: dropdownLeft, width: width as DimensionValue, maxHeight: '50%' }]}>
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
      }
    </View>
  )
})
 
const styles = StyleSheet.create({
  dropDownBtn: {
    ...Spacing.flexRow,
    ...UI.input,
    position: 'relative',
    justifyContent: 'space-between',
    marginVertical: 5,
    width: '100%',
  },
  content: {
    position: 'absolute',
    ...UI.cardWithShadow,
    backgroundColor: Colors.white,
    width: '100%',
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