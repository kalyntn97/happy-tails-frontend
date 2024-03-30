//npm modules
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, SectionList, ScrollView, Image } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import LottieView from "lottie-react-native"
//components
import { AddButton } from "@components/ButtonComponent"
import PlaceHolder from "@components/PlaceHolder"
import Loader from "@components/Loader"
import EmptyList from "@components/EmptyList"
//types & helpers
import { Care } from "@care/CareInterface"
import { getIconSource } from "@utils/ui"
//queries
import { useGetAllCares } from "@care/careQueries"
//styles
import { Buttons, Spacing, Typography, Colors, Forms } from '@styles/index'

type CareIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

type CareSection = {
  title: string
  data: Care[] 
}

const CareItem = ({ care, navigation }) => {
  const iconSource = getIconSource(care.name)

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Details', { care })}
      style={[styles.itemContainer,
      { backgroundColor: Colors.multiArray3[care.color] }
    ]}>
      <View style={styles.itemLeft}>
        <Image source={iconSource} style={styles.itemIcon} />
        <Text style={styles.itemText}>{care.name}</Text>
        <Text style={styles.itemText}>{care.frequency}</Text>
      </View>
      <Image source={require('@assets/icons/next2.png')} style={styles.rightIcon} />
    </TouchableOpacity>
  )
}

const CareIndexScreen: React.FC<CareIndexProps> = ({ navigation, route }) => {
  const { data: cares, isLoading, isSuccess, isError} = useGetAllCares()
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
  //   }
  //   return Object.values(result)
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
          styles.subBtn, { backgroundColor: Colors.multiArray[idx] }, filtered.includes(section.title) && { opacity: 0.3 }
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
  
  return (
    <View style={styles.container}>
      <AddButton onPress={() => navigation.navigate('Create')} />
      {isSuccess ?
        <>
          { !Object.values(cares).length && <PlaceHolder /> }
          
          
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
            ListEmptyComponent={ <EmptyList /> }
          />
        </> : <Loader />
      }
        
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  mainBtn: {
    ...Buttons.longSquare,
    backgroundColor: Colors.pink,
  },
  subBtn: {
    ...Buttons.xxSmallRounded,
    margin: 5,
    width: 85,
  },
  btnText: {
    ...Buttons.buttonText
  },
  listHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCount: {
    color: Colors.red,
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