//npm modules
import Fuse from "fuse.js"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { DimensionValue, FlatList, Keyboard, Modal, NativeSyntheticEvent, Pressable, ScrollViewProps, StyleSheet, Text, TextInput, TextInputEndEditingEventData, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
//helpers 
import * as careHelpers from '@care/careHelpers'
import * as healthHelpers from '@health/healthHelpers'
import * as petHelpers from '@pet/petHelpers'
//components
import { ErrorMessage, Icon, VScrollContainer } from "@components/UIComponents"
//styles
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { lightPalette } from "@styles/ui"
import { windowHeight } from "@utils/constants"

interface DropdownProps {
  label?: string
  dataType?: string
  dataArray?: { _id: string, name: string, [key: string]: any }[]
  onSelect: (item: string | any ) => void
  onSelectCustom?: (text: string) => void
  shouldReset: boolean
  width?: number
  contentWidth?: number
  initial?: string
  withSearch?: boolean
  withBorder?: boolean
  searchLabel?: string
  error?: string
  buttonTextStyles?: TextStyle
  buttonStyles?: ViewStyle
  contentPosition?: 'top' | 'bottom',
  align?: 'left' | 'right'
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
  'medStatus': () => petHelpers.MEDICATION_STATUS,
  'conditionTypes': () => petHelpers.HEALTH_CONDITION_TYPES,
  'conditionStatus': () => petHelpers.HEALTH_CONDITION_STATUS,
  'serviceTypes': () => petHelpers.SERVICE_TYPES,
  'allergySymptoms': () => petHelpers.ALLERGY_SYMPTOMS,
  'allergyTypes': () => petHelpers.ALLERGIES.map(i => i.icon)
}

const scrollProps = { keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false } as ScrollViewProps

const Dropdown = memo(({ label, dataType, withSearch = false, dataArray, onSelect, onSelectCustom, shouldReset, width = 80, contentWidth, initial, buttonStyles, buttonTextStyles, searchLabel, contentPosition = 'bottom', error, withBorder = true, align = 'left' }: DropdownProps) => {
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
    DropdownBtn.current.measure((fx, fy, _w, h, px, py) => {
      setDropdownTop(withSearch? fy + h : py + h)
      setDropDownLeft(withSearch ? fx - 10 : px - (withBorder ? 0 : 10)) 
    })
    setVisible(true)
  }

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropDown()
  }
  
  const onItemPress = (item: string): void => {
    if (withSearch) {
      Keyboard.dismiss()
      setSearchInput(item)
      setFocused(false)
    } else {
      setSelected(item)
    }
    dataArray ? onSelect(dataArray.find(i => i.name === item)) : onSelect(item)
    //* reset the search input
    if (shouldReset) withSearch ? setSearchInput(initial) : setSelected(initial)
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

  const onSubmit = (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    if (onSelectCustom) onSelectCustom(e.nativeEvent.text)
    setVisible(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      let result = []
      if (dataArray) result = dataArray.map(item => item.name)
      else if (dataType) result = await typeToSource[dataType]()
      if (!ignore) setData(result)
    }
    let ignore = false
    fetchData()
    withSearch ? setSearchInput(initial) : setSelected(initial)

    return () => {
      ignore = true
    }
  }, [dataType, initial])

  const dropdownBtnStyles = useMemo(() => ([
    styles.dropDownBtn,
    withBorder ? UI.input() : UI.input(false, 0, 0, 0),
    (focused || visible) && UI.focused,
    buttonStyles,
  ]) as unknown as ViewStyle, [focused, visible, buttonStyles, withBorder])

  const modalStyles = useMemo(() => ([
    styles.modalCon,
    {
      left: dropdownLeft,
      maxHeight: withSearch ? dropdownTop * 4 : '50%',
      width: `${contentWidth ?? (withSearch ? 100 : width - (width > 50 ? 20 : 10))}%`,
    },
    contentPosition === 'bottom' ? { top: dropdownTop } : { bottom: dropdownTop },
  ]) as unknown as ViewStyle, [dropdownLeft, dropdownTop, contentPosition, contentWidth, width])

  return (
    <View style={[styles.container, { width: `${width}%` as DimensionValue, zIndex: focused ? 100 : 2 }]}>
      { withSearch ?
        <>
          <View style={dropdownBtnStyles} ref={DropdownBtn}>
            <Icon name='search' size='xSmall' styles={{ marginRight: 15 }}/>
            <TextInput
              style={[{ flex: 1, textAlign: align }, buttonTextStyles]}
              placeholder={label ?? 'enter search'}
              placeholderTextColor={UI.lightPalette().unfocused}
              value={searchInput}
              onChangeText={onSearch}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={onSubmit}
              maxLength={50}
              selectTextOnFocus={true}
            />
          </View>

          { visible && 
            <View style={modalStyles}>
              <VScrollContainer props={{ ...scrollProps }}>
                { searchResults.length > 1 ? searchResults.map(result =>
                    <TouchableOpacity key={result.item} style={styles.itemCon} onPress={() => onItemPress(result.item)}>
                      <Text style={{ color: lightPalette().text }}>
                        { result.item }
                      </Text>
                    </TouchableOpacity>
                )
                : <Text>No {searchLabel ?? 'item'} found.</Text> }
              </VScrollContainer>
            </View> 
          }
        </>
      : 
        <>
          <TouchableOpacity style={dropdownBtnStyles} onPress={toggleDropdown} ref={DropdownBtn}>
            <Text style={[{ flex: 1, textAlign: align  }, buttonTextStyles]}>{selected ?? label}</Text>
            <Icon name={visible ? 'up' : 'down'} size='xSmall' styles={{ marginLeft: 15 }} />
          </TouchableOpacity>

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
        </>
      }
      { error && <ErrorMessage error={error} styles={{ textAlign: align }}/> }
    </View>
  )
})
 
const styles = StyleSheet.create({
  container :{
    position: 'relative',
  },
  dropDownBtn: {
    ...Spacing.flexRow,
    width: '100%',
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
    borderBottomWidth: 2,
  },
})

export default Dropdown