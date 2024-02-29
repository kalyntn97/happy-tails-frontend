//npm modules
import { useEffect, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View, SectionList, ScrollView, Image } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import LottieView from "lottie-react-native"
//components
import { AddButton } from "@components/ButtonComponent"
import PlaceHolder from "@components/PlaceHolder"
//store
import { useCares } from "@store/store"
//types & helpers
import * as careHelpers from "@care/careHelpers"
//styles
import { Buttons, Spacing, Typography, Colors, Forms } from '@styles/index'
import Loader from "@components/Loader"

type CareIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

const CareIndexScreen: React.FC<CareIndexProps> = ({ navigation, route }) => {
  const careCards = useCares()
  const sortedCareCards = careHelpers.sortByFrequency(careCards)

  // custom sort function by section
  const sortOrder = ['Daily', 'Weekly', 'Monthly', 'Yearly']
  
  const careIndex = sortOrder.map(sectionTitle => ({
    title: sectionTitle,
    data: sortedCareCards[sectionTitle] || []
  }))

  const CareItem = ({ care }) => {
    const iconSource = careHelpers.getIconSource(care.name)
  
    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate('Details', { care: care })}
        style={[styles.itemContainer,
        { backgroundColor: careHelpers.getTaskBackgroundColor(care.frequency) }
      ]}>
        <View style={styles.itemLeft}>
          <Image source={iconSource} style={styles.itemIcon} />
          <Text>{care.name}</Text>
        </View>
        <Image source={require('@assets/icons/next2.png')} style={{...Forms.smallIcon, marginRight: 10 }} />
      </TouchableOpacity>
    )
  }

  // another method that uses for.. of loop and IIFE
  // const careIndex: Array<{ title: string, data: Care[] }> = (() => {
  //   const result = Object.create(null)
  //   for (const careCard of careCards) {
  //     const { frequency } = careCard
  //     result[frequency] = result[frequency] || { title: frequency, data: [] }
  //     result[frequency].data.push(careCard)
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

  const handleHeaderPress = (sectionIdx: number) => {
    sectionListRef.current.scrollToLocation({ sectionIndex: sectionIdx, itemIndex: 0 })
  }

  useEffect(() => {
    if (route.params) {
      const { sectionIndex, itemIndex } = route.params
      const setInitialListPosition = () => {
        sectionListRef.current.scrollToLocation({ sectionIndex: sectionIndex, itemIndex: itemIndex + 1})
      }
      setInitialListPosition()
    }
  }, [route.params])
  
  return (
    <View style={styles.container}>
      <AddButton onPress={() => navigation.navigate('Create')} />
      {careIndex ? 
        <>
          { !careIndex.length && <PlaceHolder /> }

          <ScrollView 
            horizontal
            style={styles.listHeader}
            showsHorizontalScrollIndicator={false}
          >
            {careIndex.map((section, idx) => 
              <TouchableOpacity key={`title-${idx}`} style={[styles.subBtn, { backgroundColor: Colors.multiArray[idx] }]} onPress={() => handleHeaderPress(idx)}>
                <Text>{section.title}</Text>
                <Text style={styles.headerCount}>{section.data.length}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <SectionList
            ref={sectionListRef}
            sections={careIndex}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <CareItem care={item} />
            )}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            style={{ width: '90%' }}
            // ListEmptyComponent={<Text>Empty...</Text>}
          />
        </>
        : <Loader />
      }
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered,
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
    marginTop: 50,
    height: 0,
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
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    borderRadius: 15,
    height: 60,
  },
  itemLeft: {
    ...Spacing.flexRow,
    justifyContent: 'space-evenly'
  },
  itemIcon: {
    ...Forms.icon,
    marginHorizontal: 10,
  },
  itemBtn: {
    marginLeft: 'auto'
  },
})
 
export default CareIndexScreen