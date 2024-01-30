//npm modules
import { useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, SectionList } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import LottieView from "lottie-react-native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
//components
import CareCard from "../components/CareCard"
//services & utils
import { useCareContext } from "../context/CareContext"
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

type CareIndexProps = {
  navigation: DrawerNavigationProp<{}>
  route: { params?: { sectionIndex: number, itemIndex: number }}
}

const CareIndexScreen: React.FC<CareIndexProps> = ({ navigation, route }) => {
  const { careCards } = useCareContext()

  const sectionListRef = useRef<SectionList>(null)
  
  const daily = []
  const weekly = []
  const monthly = []
  const yearly = []

  careCards.forEach(care => {
    switch (care.frequency) {
      case 'Daily': 
        daily.push(care)
        break
      case 'Weekly': 
        weekly.push(care)
        break
      case 'Monthly': 
        monthly.push(care)
        break
      case 'Yearly': 
        yearly.push(care)
        break
    }
  })

  const careIndex = [
    { title: 'Daily', data: daily },
    { title: 'Weekly', data: weekly },
    { title: 'Monthly', data: monthly },
    { title: 'Yearly', data: yearly },
  ]
 
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
    if (route.params && route.params.sectionIndex && route.params.itemIndex) {
        const { sectionIndex, itemIndex } = route.params
        const setInitialListPosition = () => {
        sectionListRef.current.scrollToLocation({ sectionIndex: sectionIndex, itemIndex: itemIndex + 1})
      }
      setInitialListPosition()
    }
  }, [route.params])
  
  return (
    <View style={styles.container}>
      {!careCards.length &&
        <View style={styles.empty}>
          <LottieView source={require('../assets/animations/cat-yarn.json')} autoPlay loop style={styles.catAnimation} />
          <Text style={styles.msg}>Start managing your pet's health</Text>
        </View>
      }
      <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.btnText}>Add a tracker</Text>
      </TouchableOpacity>

      <View style={styles.listHeader}>
        {careIndex.map((section, idx) => 
          <TouchableOpacity key={idx} style={[styles.subBtn, { backgroundColor: Colors.multiArray[idx] }]} onPress={() => handleHeaderPress(idx)}>
            <Text>{section.title}</Text>
            <Text style={styles.headerCount}>{section.data.length}</Text>
          </TouchableOpacity>
        )}
      </View>
      <SectionList
        ref={sectionListRef}
        sections={careIndex}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <CareCard key={item._id} care={item} navigation={navigation}/>
        )}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
    ...Spacing.centered,
  },
  msg: {
    ...Typography.subHeader,
    color: Colors.darkPink,
    marginTop: 50
  },
  catAnimation: {
    width: '100%'
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
    ...Spacing.flexRow,
  },
  headerCount: {
    color: Colors.red,
    fontWeight: 'bold',
    position: 'absolute',
    right: '10%',
    top: '10%',
  },
})
 
export default CareIndexScreen