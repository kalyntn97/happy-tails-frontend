import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js'
//utils & helpers
import { getCareIconSource, getHealthIconSource, getStatIconSource } from '@utils/ui'
import { CARES } from '@care/careHelpers'
import { HEALTHS } from '@health/healthHelpers'
import { STATS } from '@stat/statHelpers'
//styles
import { Spacing, Typography, Colors, UI } from '@styles/index'
import { FormInput } from './UIComponents'

type Props = {
  type: 'care' | 'health' | 'log'
  initial: string
  placeholder?: string
  onChange: (title: string) => void
  error?: string
}

const TitleInput = ({ type, initial, onChange, placeholder, error }: Props) => {
  const titleMap = {
    care: { iconSource: getCareIconSource, titles: CARES },
    health: { iconSource: getHealthIconSource, titles: HEALTHS },
    log: { iconSource: getStatIconSource, titles: STATS },
  }
  const titles: { title: string, icon: string }[] = titleMap[type].titles

  const fuse = new Fuse(titles, { keys: ['title', 'icon'] })

  const [title, setTitle] = useState<string>(initial)
  const [titleSearch, setTitleSearch] = useState<FuseResult<any>[]>([])
  const [icon, setIcon] = useState<string>(initial ? fuse.search(initial)[0]?.item.icon : 'others')
  const [visible, setVisible] = useState(false)
  const [dropdownTop, setDropdownTop] = useState(0)
  const [dropdownLeft, setDropDownLeft] = useState(0)

  const iconSource = titleMap[type].iconSource(icon)

  const handleChange = (input: string) => {
    const search = fuse.search(input)
    setTitle(input)
    setTitleSearch(search)
    openDropDown()
    setIcon(search[0]?.item.icon ?? 'others')
    onChange(input)
  }

  const openDropDown = (): void => {
    setVisible(_ => {
      titleBtn.current.measure((fx, fy, _w, h, px, _py) => {
        setDropdownTop(fy + h + 10)
        setDropDownLeft(px - fx) 
      })
      return true
    })
  }

  const handlePress = (item: string) => {
    Keyboard.dismiss()
    setVisible(false)
    setTitle(item)
  }

  const titleBtn = useRef(null)
  const TITLE_LENGTH = 50

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setVisible(false)
    })
    return () => {
      hideSubscription.remove()
    }
  }, [])

  return (
    <View style={styles.container}>
      { iconSource ? <Image source={iconSource} style={UI.largeIcon}/> : <ActivityIndicator /> }
      <View style={[Spacing.flexColumn, { width: '100%', alignItems: 'flex-start' }]}>
        <FormInput value={title} placeholder={placeholder} onChange={handleChange} props={{ autoCapitalize: 'words', multiline: true }} ref={titleBtn} styles={styles.input} maxLength={TITLE_LENGTH} error={error} />
        <Text style={styles.subTitle}>{title?.length > 0 ? TITLE_LENGTH - title.length : TITLE_LENGTH}/{TITLE_LENGTH}</Text>
      </View>
      { visible && titleSearch.length > 0 &&
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
}

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