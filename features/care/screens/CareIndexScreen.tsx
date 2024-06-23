//npm modules
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, SectionList, ScrollView, Image } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
//components
import PlaceHolder from "@components/PlaceHolder"
import Loader from "@components/Loader"
import { RoundButton } from "@components/ButtonComponent"
//types & helpers
import { Care } from "@care/CareInterface"
import { CARES } from "@care/careHelpers"
import { getActionIconSource, getCareIconSource } from "@utils/ui"
//queries
import { profileKeyFactory, useGetProfile } from "@profile/profileQueries"
//styles
import { Buttons, Spacing, Colors, Forms } from '@styles/index'
import { ErrorImage } from "@components/UIComponents"
import { useQueryClient } from "@tanstack/react-query"
import { ProfileData } from "@profile/ProfileInterface"

type CareIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

type CareSection = {
  title: string
  data: Care[] 
}

const CareItem = ({ care, navigation }) => {
  const iconSource = getCareIconSource(care.name)
  
  return (
    <TouchableOpacity 
      disabled={!care.repeat}
      onPress={() => navigation.navigate('CareDetails', { care })}
      style={[styles.itemContainer,
      { backgroundColor: Colors.multi.light[care.color], opacity: !care.repeat ? 0.5 : 1 }
      ]}
      
    >
      <View style={styles.itemLeft}>
        <Image source={iconSource} style={styles.itemIcon} />
        <Text style={styles.itemText}>{CARES[care.name] ?? care.name}</Text>
        <Text style={[styles.itemText, { color: 'gray' }]}>{care.frequency}</Text>
      </View>
      <Image source={getActionIconSource('nextRound')} style={styles.rightIcon} />
    </TouchableOpacity>
  )
}

const CareIndexScreen: React.FC<CareIndexProps> = ({ navigation, route }) => {
  const queryClient = useQueryClient()
  const caresCache = queryClient.getQueryData<ProfileData>(profileKeyFactory.profile).cares
  const { data, isSuccess, isFetching, isError } = useGetProfile(!caresCache)
  const cares = data.cares
  
  const [filtered, setFiltered] = useState<string[]>([])

  const sortOrder = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Others']
  const careIndex: CareSection[] = sortOrder.map(sectionTitle => ({
    title: sectionTitle,
    data: cares[!filtered.includes(sectionTitle) && sectionTitle] || []
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

  const CareListHeader = () => (
    <ScrollView 
      horizontal
      contentContainerStyle={styles.listHeader}
      showsHorizontalScrollIndicator={false}
    >
      {careIndex.map((section: CareSection, idx: number) => 
        <TouchableOpacity key={`title-${idx}`} style={[
          styles.subBtn, { backgroundColor: Colors.multi.light[idx] }, filtered.includes(section.title) && { opacity: 0.3 }
          ]} onPress={() => handleHeaderPress(section.title, idx)}
        >
          <Text>{section.title}</Text>
          <Text style={styles.headerCount}>{section.data.length}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )

  useEffect(() => {
    if (route.params) {
      const { sectionIndex, itemIndex } = route.params
      const setInitialListPosition = () => {
        sectionListRef.current.scrollToLocation({ sectionIndex: sectionIndex, itemIndex: itemIndex + 1})
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
              <CareItem key={item._id} care={item} navigation={navigation} />
            )}
            // renderSectionHeader={({ section }) => (
            //   <Text>{section.title}</Text>
            // )}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}
          />
        : <PlaceHolder key='task' navigation={navigation} />
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
    marginHorizontal: 5,
    marginVertical: 0,
    
    borderWidth: 0,
  },
  btnText: {
    ...Buttons.buttonText
  },
  listHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCount: {
    color: Colors.red.reg,
    fontWeight: 'bold',
    position: 'absolute',
    right: '10%',
    top: '10%',
  },
  itemContainer: {
    ...Spacing.flexRow,
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 5,
    borderRadius: 15,
    height: 60,
  },
  itemLeft: {
    ...Spacing.flexRow,
    justifyContent: 'space-evenly',
    marginRight: 'auto',
  },
  itemIcon: {
    ...Forms.icon,
    marginHorizontal: 10,
  },
  itemBtn: {
    marginLeft: 'auto'
  },
  itemText: {
    marginRight: 10,
    flex: 2,
  },
  rightIcon: {
    ...Forms.smallIcon, 
    marginRight: 10 
  }
})
 
export default CareIndexScreen