//npm modules
import { useEffect, useRef, useState } from "react"
import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
//components
import { AnimatedButton } from "@components/ButtonComponents"
import Loader from "@components/Loader"
import PetList from "@components/PetInfo/PetList"
import PlaceHolder from "@components/PlaceHolder"
import { ErrorImage, Icon, ScrollHeader } from "@components/UIComponents"
//types & helpers
import { Care } from "@care/CareInterface"
import { CARES, getCareIcon } from "@care/careHelpers"
//queries
import { useGetProfile } from "@profile/profileQueries"
//styles
import { Header } from "@navigation/NavigationStyles"
import { Buttons, Colors, Spacing, UI } from '@styles/index'
import { FREQUENCY_TYPES } from "@utils/constants"
import { verticalScrollProps, wrappedTextProps } from "@styles/ui"


type CareIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

type CareSection = {
  title: string
  data: Care[] 
}

const MIN_TASK_HEIGHT = 60
const MAX_TASK_HEIGHT = 70

const HeaderButton = ({ bgColor, onPress, title, count, active }: { bgColor: string, onPress: () => void, title: string, count: number, active: boolean }) => (
  <TouchableOpacity style={[
    styles.subBtn, { backgroundColor: bgColor }
    ]} onPress={onPress}
  >
    <Text style={{ fontSize: 12}}>{title}</Text>
    <Text style={[styles.headerCount, { color: active ? Colors.red.darkest : Colors.red.reg }]}>{count}</Text>
  </TouchableOpacity>
)

const CareItem = ({ care, navigation }) => {
  const iconSource = getCareIcon(care.name)
  const taskColor = FREQUENCY_TYPES.findIndex(f => f === care.frequency.type)
  
  const TASK_HEIGHT = care.name.length < 30 ? MIN_TASK_HEIGHT : MAX_TASK_HEIGHT
  
  return (
    <AnimatedButton disabled={!care.repeat} scaleFactor={1.1} onPress={() => navigation.navigate('CareDetails', { care })}>
      <View
        style={[styles.itemContainer,
        { height: TASK_HEIGHT, backgroundColor: Colors.multi.light[taskColor + 1], opacity: !care.repeat ? 0.5 : 1 }
        ]}
      >
        <View style={styles.itemLeft}>
          <Image source={iconSource} style={styles.itemIcon} />
          <Text { ...wrappedTextProps }>{CARES[care.name] ?? care.name}</Text>
          {/* <Text style={[styles.itemText, { color: 'gray' }]}>{care.frequency}</Text> */}
        </View>
        <PetList petArray={care.pets} size="xxSmall" />
        <Icon name="next" size="xSmall" styles={{ marginRight: 10, marginLeft: 20 }}/>
      </View>
    </AnimatedButton>
  )
}

const CareIndexScreen = ({ navigation, route }: CareIndexProps) => {
  const { data, isSuccess, isFetching, isError } = useGetProfile()
  const cares = data.cares
  
  const [filtered, setFiltered] = useState<string>(null)

  const careIndex: CareSection[] = FREQUENCY_TYPES.map(sectionTitle => ({
    title: sectionTitle,
    data: cares.filter(care => care.frequency.type === sectionTitle) || []
  }))
  
  // another method that uses for.. of loop and IIFE
  // const careIndex: Array<{ title: string, data: Care[] }> = (() => {
  //   const result = Object.create(null)
  //   for (const care of cares) {
  //     const { frequency } = care
  //     result[frequency] = result[frequency] || { title: frequency, data: [] }
  //     result[frequency].data.push(care)
  //   }n Object.values(result)
  // })()
  
  const sectionListRef = useRef<SectionList>(null)

  const getItemLayout = sectionListGetItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => 420,
    //optional
    getSeparatorHeight: () => 0, 
    getSectionHeaderHeight: () => 0,
    getSectionFooterHeight: () => 0, 
    listHeaderHeight: 0,
  })

  const handleHeaderPress = (sectionToFilter: string, sectionIdx: number) => {
    // sectionListRef.current.scrollToLocation({ sectionIndex: sectionIdx, itemIndex: 0 })
    setFiltered(sectionToFilter)
  }

  const handlePressAll = () => {
    setFiltered(null)
  }

  const CareListHeader = () => (
    <ScrollHeader contentStyles={{ paddingVertical: 5, paddingHorizontal: 10 }} h={0} b={10} t={0}>
      <HeaderButton bgColor={filtered === null ? Colors.multi.dark[0] : Colors.multi.light[0]} onPress={handlePressAll} title='All' count={cares.length} active={filtered === null} />
      {careIndex.map((section: CareSection, idx: number) => 
        <HeaderButton key={`title-${idx}`}
          bgColor={filtered === section.title ? Colors.multi.dark[idx + 1] : Colors.multi.light[idx + 1]} 
          onPress={() => handleHeaderPress(section.title, idx)} 
          title={section.title} count={section.data.length}
          active={filtered === section.title}
        />
      )}
    </ScrollHeader>
  )

  useEffect(() => {
    if (route.params) {
      const { sectionIndex, itemIndex } = route.params
      const setInitialListPosition = () => {
        if (sectionListRef.current) {
          sectionListRef.current.scrollToLocation({ sectionIndex: sectionIndex, itemIndex: itemIndex + 1})
        }
      }
      setInitialListPosition()
    }
    navigation.setOptions({
      header: () => <Header title='All Pet Care' showGoBackButton={true} rightActions={[{ title: 'Add', onPress: () => navigation.navigate('CareCreate') }]} navigation={navigation} mode='card' />
    })
    
  }, [route.params, isSuccess])
  
  if (isFetching) return <Loader />
  if (isError) return <ErrorImage />

  return (
    <View style={Spacing.fullCon()}>
      {/* <RoundButton onPress={() => navigation.navigate('CareCreate')} type='add' position="topRight"  /> */}
      <CareListHeader />
      { isSuccess && (
        cares.length > 0 ?
          <SectionList
            ref={sectionListRef}
            sections={careIndex}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              (filtered === item.frequency.type || filtered === null) && <CareItem key={item._id} care={item} navigation={navigation} />
            )}
            getItemLayout={getItemLayout}
            { ...verticalScrollProps }
            style={{ width: '100%' }}
          />
        : <PlaceHolder type='care' />
      )}
    </View> 
  )
}

const styles = StyleSheet.create({
  subBtn: {
    ...Spacing.flexRow,
    ...Buttons.solid,
    ...Buttons.rounded,
    justifyContent: 'space-around',
    width: 100,
    height: 35,
    marginHorizontal: 5,
    marginVertical: 0,
    borderWidth: 0,
  },
  btnText: {
    fontSize: 12,
  },
  listHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCount: {
    fontWeight: 'bold',
  },
  itemContainer: {
    ...Spacing.flexRow,
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 5,
    borderRadius: 15,
  },
  itemLeft: {
    ...Spacing.flexRow,
    flex: 1,
    marginRight: 10,
  },
  itemIcon: {
    ...UI.icon(),
    marginHorizontal: 10,
  },
  itemBtn: {
    marginLeft: 'auto'
  },
})
 
export default CareIndexScreen