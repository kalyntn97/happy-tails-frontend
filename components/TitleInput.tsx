import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js'
//utils & helpers
import { getCareIconSource, getHealthIconSource, getStatIconSource } from '@utils/ui'
import { CARES } from '@care/careHelpers'
import { HEALTHS } from '@health/healthHelpers'
import { STATS } from '@stat/statHelpers'
//styles
import { Spacing, Typography, Colors, UI } from '@styles/index'
import { ErrorMessage, FormInput } from './UIComponents'

type Props = {
  type: 'care' | 'health' | 'log'
  initial?: string
  placeholder?: string
  onChange: (title: string) => void
  error?: string
}

const TITLE_LENGTH = 50

const titleMap = {
  care: { iconSource: getCareIconSource, titles: CARES },
  health: { iconSource: getHealthIconSource, titles: HEALTHS },
  log: { iconSource: getStatIconSource, titles: STATS },
}

const TitleInput = memo(({ type, initial, onChange, placeholder, error }: Props) => {
  const titleBtn = useRef(null)
  const fuse = useMemo(() => {
    const titles: { title: string, icon: string }[] = titleMap[type].titles
    return new Fuse(titles, { keys: ['title', 'icon'] })
  }, [type])

  const [title, setTitle] = useState(initial ?? null)
  const [titleSearch, setTitleSearch] = useState<FuseResult<any>[]>([])
  const [icon, setIcon] = useState<string>(initial ? fuse.search(initial)[0]?.item.icon : 'others')
  const [visible, setVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [dropdownLeft, setDropDownLeft] = useState(0)

  const iconSource = useMemo(() => titleMap[type].iconSource(icon), [type, icon])
  const validatedStyles = useMemo(() => error ? UI.inputError : isFocused ? UI.inputFocused : UI.inputUnfocused, [error, isFocused])
  
  const openDropDown = (input: string) => {
    const search = fuse.search(input)
    setIcon(search[0]?.item.icon ?? 'others')
    if (input === search[0]?.item.title) {
      setVisible(false)
      return
    }
    setTitleSearch(search)
    setVisible(_ => {
      titleBtn.current.measure((fx, fy, _w, h, px, _py) => {
        setDropdownTop(fy + h + 10)
        setDropDownLeft(px - fx) 
      })
      return true
    })
  }

  const handleChange = (input: string) => {
    setTitle(input)
    openDropDown(input)
  }

  const handlePress = (item: string) => {
    handleChange(item)
    onChange(item)
    setIsFocused(false)
    Keyboard.dismiss()
  }

  return (
    <View style={styles.container}>
      { iconSource ? <Image source={iconSource} style={UI.largeIcon}/> : <ActivityIndicator /> }
      <View style={[Spacing.flexColumn, { width: '100%', alignItems: 'flex-start' }]}>
        <TextInput
          ref={titleBtn}
          style={[styles.input, validatedStyles]}
          placeholder={placeholder}
          placeholderTextColor={UI.lightPalette.unfocused}
          value={title}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => handlePress(title)}
          maxLength={TITLE_LENGTH}
          selectTextOnFocus={true}
          autoCapitalize='words'
          multiline={true}
        />
        <View style={[Spacing.flexRow, { marginTop: 10, marginLeft: 10 }]}>
          { error && <ErrorMessage error={error} styles={{ margin: 0, marginRight: 30 }}/> }
          { isFocused && 
            <Text style={{ color: UI.lightPalette.unfocused, fontSize: 12 }}>
              {TITLE_LENGTH - (title ? title.length : 0)} / {TITLE_LENGTH}
            </Text> 
          }
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

export default TitleInput

const styles = StyleSheet.create({
  container: {
    ...Spacing.flexRow,
    width: '100%',
    zIndex: 1,
    alignSelf: 'flex-start'
  },
  input: {
    ...Typography.smallHeader,
    margin: 0,
    marginLeft: 10,
    maxWidth: '60%',
    textAlign: 'left',
  },
  content: {
    ...UI.boxShadow,
    position: 'absolute',
    backgroundColor: Colors.pink.lightest,
    padding: 20,
    borderRadius: 8,
    width: '60%',
    zIndex: 2,
  },
  subTitle: {
    ...Typography.xSmallBody,
    color: UI.lightPalette.unfocused,
    marginLeft: 10,
  },
}) 