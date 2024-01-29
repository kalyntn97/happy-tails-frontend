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
  route: { params?: { careId?: string }}
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
     // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => 420,
    //optional
    getSeparatorHeight: () => 0, 
    getSectionHeaderHeight: () => 0,
    getSectionFooterHeight: () => 0, 
    listHeaderHeight: 0,
  })

  const handleHeaderPress = (sectionIdx: number) => {
    console.log('section pressed', sectionIdx)
    sectionListRef.current.scrollToLocation({ sectionIndex: sectionIdx, itemIndex: 0 })
  }

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
          <TouchableOpacity key={idx} style={styles.subBtn} onPress={() => handleHeaderPress(idx)}>
            <Text>{section.title}</Text>
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
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
  },
  scrollView: {
    width: '100%',
  },
  empty: {
    
  },
  msg: {
    ...Typography.subHeader,
    color: Colors.darkPink,
    marginTop: 50
  },
  catAnimation: {
    width: '100%'
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  mainBtn: {
    ...Buttons.longSquare,
    backgroundColor: Colors.pink,
  },
  subBtn: {
    ...Buttons.xxSmallRounded,
    backgroundColor: Colors.green,
  },
  btnText: {
    ...Buttons.buttonText
  },
  listHeader: {
    ...Spacing.flexRow,
  },
})
 
export default CareIndexScreen