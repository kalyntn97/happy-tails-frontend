//npm modules
import { FC, useEffect, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View, SectionList, ScrollView, Image, Button } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import LottieView from "lottie-react-native"
//components
import { AddButton, GoBackButton } from "@components/ButtonComponent"
import PlaceHolder from "@components/PlaceHolder"
import Loader from "@components/Loader"
//types & helpers
import { Health } from "@health/HealthInterface"
import { getIconSource } from "@utils/ui"
//queries
import { useGetAllHealths } from "@health/healthQueries"
//styles
import { Buttons, Spacing, Typography, Colors, Forms } from '@styles/index'
import { usePetIds, useShallowPetBasics } from "@store/storeUtils"
import PetInfo from "@components/PetInfo/PetInfo"

type HealthIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

type HealthItemProps = {
  health: Health
  navigation: any
}

const HealthItem: FC<HealthItemProps> = ({ health, navigation }) => {
  const iconSource = getIconSource(health.name)

  return (
    <TouchableOpacity 
      // onPress={() => navigation.navigate('Details', { care: care })}
      style={[styles.itemContainer,
      { backgroundColor: Colors.multiArray3[health.pet.color] }
    ]}>
      <View style={styles.itemLeft}>
        <Image source={iconSource} style={styles.itemIcon} />
        <Text>{health.name}</Text>
      </View>
      <Image source={require('@assets/icons/next2.png')} style={{...Forms.smallIcon, marginRight: 10 }} />
    </TouchableOpacity>
  )
}

const HealthIndexScreen: FC<HealthIndexProps> = ({ navigation, route }) => {
  const { data: healths, isLoading, isSuccess, isError} = useGetAllHealths()
  const pets = useShallowPetBasics()

  const petIdToPet = (petId: string) => {
    return pets.find(pet => pet._id === petId)
  }
  
  const sortOrder = pets.map(pet => pet._id)
  
  const healthIndex: { title: string; data: Health[] }[] = sortOrder.map(petId => ({
    title: petId,
    data: healths.filter(health => health.pet._id === petId) || []
  }))
  
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
  }, [route.params, isSuccess])
  
  return (
    <View style={styles.container}>
      <AddButton onPress={() => navigation.navigate('Create')} />
      {isSuccess ?
        <>
          { !healths.length && <PlaceHolder /> }
          <View style={styles.headerCon}>
            <ScrollView 
              horizontal
              contentContainerStyle={styles.listHeader}
              showsHorizontalScrollIndicator={false}
            >
              {healthIndex.map((section, idx) => 
                <TouchableOpacity key={`title-${idx}`} style={[styles.subBtn]} onPress={() => handleHeaderPress(idx)}>
                  {/* <Text style={styles.headerCount}>{section.data.length}</Text> */}
                  <PetInfo pet={petIdToPet(section.title)} size='small' />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          
          <SectionList
            ref={sectionListRef}
            sections={healthIndex}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => (
              <HealthItem key={item._id} health={item} navigation={navigation} />
            )}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            style={{ width: '90%' }}
            // ListEmptyComponent={<Text>Empty...</Text>}
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
    width: 80,
  },
  btnText: {
    ...Buttons.buttonText
  },
  headerCon: {
    height: '18%',
  },
  listHeader: {
    marginVertical: 10,
  },
  headerIcon: {
    ...Forms.xxSmallPhoto,
  },
  headerCount: {
    color: Colors.red,
    fontWeight: 'bold',
    position: 'absolute',
    right: '10%',
    bottom: '10%',
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
 
export default HealthIndexScreen