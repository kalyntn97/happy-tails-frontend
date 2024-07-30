//npm modules
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, SectionList, ScrollView, Image } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
//components
import PlaceHolder from "@components/PlaceHolder"
import Loader from "@components/Loader"
import { RoundButton } from "@components/ButtonComponents"
import PetList from "@components/PetInfo/PetList"
import { EmptyList, ErrorImage } from "@components/UIComponents"
//types & helpers
import { Care } from "@care/CareInterface"
import { CARES, getCareIcon } from "@care/careHelpers"
import { getActionIconSource, getCareIconSource } from "@utils/ui"
//queries
import { profileKeyFactory, useGetProfile } from "@profile/profileQueries"
//styles
import { Buttons, Spacing, Colors, UI } from '@styles/index'


type CareIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

type CareSection = {
  title: string
  data: Care[] 
}

const SORT_ORDER = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Others']

const MIN_TASK_HEIGHT = 60
const MAX_TASK_HEIGHT = 70

const HeaderButton = ({ bgColor, opacity, onPress, title, count }: { bgColor: string, opacity: number, onPress: () => void, title: string, count: number }) => (
  <TouchableOpacity style={[
    styles.subBtn, { backgroundColor: bgColor, opacity: opacity }
    ]} onPress={onPress}
  >
    <Text style={{ fontSize: 12}}>{title}</Text>
    <Text style={styles.headerCount}>{count}</Text>
  </TouchableOpacity>
)

const CareItem = ({ care, navigation }) => {
  const iconSource = getCareIcon(care.name)
  const taskColor = SORT_ORDER.findIndex(f => f === care.frequency)
  const TASK_HEIGHT = care.name.length < 30 ? MIN_TASK_HEIGHT : MAX_TASK_HEIGHT
  
  return (
    <TouchableOpacity 
      disabled={!care.repeat}
      onPress={() => navigation.navigate('CareDetails', { care })}
      style={[styles.itemContainer,
      { height: TASK_HEIGHT, backgroundColor: Colors.multi.light[taskColor + 1], opacity: !care.repeat ? 0.5 : 1 }
      ]}
    >
      <View style={styles.itemLeft}>
        <Image source={iconSource} style={styles.itemIcon} />
        <Text style={styles.itemText}>{CARES[care.name] ?? care.name}</Text>
        <PetList petArray={care.pets} size='mini' />
        {/* <Text style={[styles.itemText, { color: 'gray' }]}>{care.frequency}</Text> */}
      </View>
      <Image source={getActionIconSource('next')} style={styles.rightIcon} />
    </TouchableOpacity>
  )
}

const CareIndexScreen: React.FC<CareIndexProps> = ({ navigation, route }) => {
  const { data, isSuccess, isFetching, isError } = useGetProfile()
  const cares = data.cares
  
  const [filtered, setFiltered] = useState<string[]>([])

  const careIndex: CareSection[] = SORT_ORDER.map(sectionTitle => ({
    title: sectionTitle,
    data: cares[sectionTitle] || []
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
    setFiltered(prev => {
      if (prev.includes(sectionToFilter)) {
        return prev.filter(sectionTitle => sectionTitle !== sectionToFilter)
      } else {
        return [...prev, sectionToFilter]
      }
    })
  }

  const handlePressAll = () => {
    setFiltered(prev => {
      return prev.length === SORT_ORDER.length ? [] : SORT_ORDER
    })
  }

  const CareListHeader = () => (
    <ScrollView 
      horizontal
      contentContainerStyle={styles.listHeader}
      showsHorizontalScrollIndicator={false}
    >
      <HeaderButton bgColor={Colors.multi.light[0]} opacity={filtered.length === 0 ? 1 : 0.3} onPress={handlePressAll} title='All' count={Object.values(cares).flat().length} />
      {careIndex.map((section: CareSection, idx: number) => 
        <HeaderButton key={`title-${idx}`}
          bgColor={Colors.multi.light[idx + 1]} 
          opacity={filtered.includes(section.title) ? 0.3 : 1} 
          onPress={() => handleHeaderPress(section.title, idx)} 
          title={section.title} count={section.data.length}
        />
      )}
    </ScrollView>
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
  }, [route.params, isSuccess])
  
  if (isFetching) return <Loader />
  if (isError) return <ErrorImage />

  return (
    <View style={styles.container}>
      <RoundButton onPress={() => navigation.navigate('CareCreate')} type='add' position="bottomRight" />
      { isSuccess && (
        Object.values(cares).flat().length > 0 ?
          <SectionList
            ref={sectionListRef}
            sections={careIndex}
            keyExtractor={(item, index) => item + index}
            ListHeaderComponent={ <CareListHeader /> }
            renderItem={({ item, index }) => (
              !filtered.includes(item.frequency) && <CareItem key={item._id} care={item} navigation={navigation} />
            )}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}
          />
        : <PlaceHolder type='task' navigation={navigation} />
      )}
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  subBtn: {
    ...Buttons.xxSmallRoundedSolid,
    ...Spacing.flexRow,
    width: 90,
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
    color: Colors.red.reg,
    fontWeight: 'bold',
    marginLeft: 5,
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
    // justifyContent: 'space-evenly',
    flex: 6,
  },
  itemIcon: {
    ...UI.icon,
    marginHorizontal: 10,
  },
  itemBtn: {
    marginLeft: 'auto'
  },
  itemText: {
    marginRight: 10,
    width: '40%',
  },
  rightIcon: {
    ...UI.xSmallIcon, 
    marginRight: 15,
  }
})
 
export default CareIndexScreen