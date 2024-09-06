import Fuse, { FuseResult } from 'fuse.js'
import React, { memo, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
//utils & helpers
import { CARES } from '@care/careHelpers'
import { HEALTHS } from '@health/healthHelpers'
import { STATS } from '@stat/statHelpers'
import { getIconByType, IconType } from '@utils/ui'
//components
import { ErrorMessage } from './UIComponents'
//styles
import { Spacing, UI } from '@styles/index'
import { styles as formStyles } from '@styles/stylesheets/FormStyles'
import { ALLERGIES } from '@pet/petHelpers'

type Props = {
  type: 'care' | 'health' | 'stat' | 'allergy'
  initial?: string
  placeholder?: string
  onChange: (title: string) => void
  error?: string
}

const TITLE_LENGTH = 50

const titleMap = {
  care: CARES,
  health: HEALTHS,
  log: STATS,
}

const fuzzySearch = (type: Props['type']) => {
  const titles: { title: string, icon: string }[] = titleMap[type]
  return new Fuse(titles, { keys: ['title', 'icon'] })
}

const TitleInput = memo(({ type, initial, onChange, placeholder, error }: Props) => {
  const titleBtn = useRef(null)
  const fuse = fuzzySearch(type)

  const [title, setTitle] = useState(initial ?? null)
  const [titleSearch, setTitleSearch] = useState<FuseResult<any>[]>([])
  const [icon, setIcon] = useState<string>(initial ? fuse.search(initial)[0]?.item.icon : 'others')
  const [visible, setVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [dropdownLeft, setDropDownLeft] = useState(0)

  const iconSource = useMemo(() => getIconByType(type as IconType, icon), [type, icon])
  const validatedStyles = useMemo(() => error ? UI.error : isFocused ? UI.focused : UI.unfocused, [error, isFocused])
  
  const openDropDown = (input: string) => {
    const search = fuse.search(input)
    if (!search.length) return setVisible(false)
    setIcon(search[0].item.icon ?? 'others')
    if (input === search[0].item.title) return setVisible(false)
    setTitleSearch(search)
    setVisible(_ => {
      titleBtn.current.measure((fx, fy, w, h, px, _py) => {
        setDropdownTop(fy + h + 30)
        setDropDownLeft(px - fx - 30) 
      })
      return true
    })
  }

  const handleChange = (input: string) => {
    setTitle(input)
    openDropDown(input)
  }

  const handlePress = (item: string) => {
    setTitle(item)
    onChange(item)
    setIsFocused(false)
    setVisible(false)
    Keyboard.dismiss()
  }

  return (
    <View style={[formStyles.headerCon, { zIndex: isFocused ? 10 : 2 }]}>
      { iconSource ? <Image source={iconSource} style={UI.icon('large')}/> : <ActivityIndicator /> }
      <View style={formStyles.titleCon}>
        <TextInput
          ref={titleBtn}
          style={[formStyles.title, validatedStyles]}
          placeholder={placeholder}
          placeholderTextColor={UI.lightPalette().unfocused}
          value={title}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => handlePress(title)}
          maxLength={TITLE_LENGTH}
          selectTextOnFocus={true}
          autoCapitalize='words'
          multiline={true}
        />
        <View style={[Spacing.flexRow, { position: 'absolute', bottom: 0 }]}>
          { error && <ErrorMessage error={error} styles={{ margin: 0, marginRight: 30 }} /> }
          <Text style={styles.textLength}>
            { isFocused && `${TITLE_LENGTH - (title ? title.length : 0)} / ${TITLE_LENGTH}` }
          </Text> 

        </View>
      </View>

      { visible && titleSearch.length > 1 &&
        <View style={[styles.content, { top: dropdownTop, left: dropdownLeft }]}>
          { titleSearch.map(t =>
            <TouchableOpacity key={`search-${t.item.title}`} onPress={() => handlePress(t.item.title)}>
              <Text style={{ marginVertical: 5 }}>{t.item.title}</Text>
            </TouchableOpacity>
          )}
        </View>
      }
    </View>
  )
})

const styles = StyleSheet.create({
  textLength: {
    color: UI.lightPalette().unfocused, 
    fontSize: 12
  },
  content: {
    ...UI.card(true, true),
    position: 'absolute',
    backgroundColor: UI.lightPalette().background,
    maxWidth: '90%',
    width: '50%',
    alignItems: 'flex-start',
  },
}) 

export default TitleInput
