//npm modules
import { FC, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, SectionList, ScrollView, Image, Button } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import LottieView from "lottie-react-native"
//components
import { RoundButton } from "@components/ButtonComponent"
import PlaceHolder from "@components/PlaceHolder"
import Loader from "@components/Loader"
import EmptyList from "@components/EmptyList"
//types & helpers
import PetInfo from "@components/PetInfo/PetInfo"
import { Health } from "@health/HealthInterface"
import { getActionIconSource, getHealthIconSource } from "@utils/ui"
import { HEALTHS } from "@health/healthHelpers"
//queries
import { usePetIds, useShallowPetBasics } from "@store/storeUtils"
import { useGetAllHealths } from "@health/healthQueries"
//styles
import { Buttons, Spacing, Typography, Colors, Forms } from '@styles/index'

type HealthIndexProps = {
  navigation: any
  route: { params?: { sectionIndex?: number, itemIndex?: number }}
}

type HealthItemProps = {
  health: Health
  navigation: any
}

const HealthItem: FC<HealthItemProps> = ({ health, navigation }) => {
  const iconSource = getHealthIconSource(health.name)

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Details', { healthId: health._id })}
      style={[styles.itemContainer,
      { backgroundColor: Colors.multi.light[health.pet.color] }
    ]}>
      <View style={styles.itemLeft}>
        <Image source={iconSource} style={styles.itemIcon} />
        <Text>{HEALTHS[health.name] ?? health.name}</Text>
        <View style={{ flex: 1 }}>
          <PetInfo pet={health.pet} size='mini' />
        </View>
      </View>
      <Image source={getActionIconSource('nextRound')} style={{...Forms.smallIcon, marginRight: 10 }} />
    </TouchableOpacity>
  )
}

const HealthIndexScreen: FC<HealthIndexProps> = ({ navigation, route }) => {
  const { data: healths, isLoading, isSuccess, isError} = useGetAllHealths()
  const pets = useShallowPetBasics()
  const petIds = pets.map(pet => pet._id)
  const [filtered, setFiltered] = useState<string[]>(petIds)

  const petIdToPet = (petId: string) => {
    return pets.find(pet => pet._id === petId)
  }
  
  const sortOrder = pets.map(pet => pet._id)
  
  const healthIndex: { title: string; data: Health[] }[] = sortOrder.map(petId => ({
    title: petId,
    data: healths.filter(health => 
      health.pet._id === petId && filtered.includes(health.pet._id)
    ) || []
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

  const handleHeaderPress = (petToFilter: string) => {
    // sectionListRef.current.scrollToLocation({ sectionIndex: sectionIdx, itemIndex: 0 })
    setFiltered(prev => {
      if (prev.includes(petToFilter)) {
        return prev.filter(petId => petId !== petToFilter)
      } else {
        return [...prev, petToFilter]
      }
    })
  }

  const HealthListHeader = () => (
    <ScrollView 
      horizontal
      contentContainerStyle={styles.listHeader}
      showsHorizontalScrollIndicator={false}
    > 
      <TouchableOpacity style={[styles.allBtn, filtered.length < pets.length && { opacity: 0.3 }]} onPress={() => setFiltered(prev => prev.length === pets.length ? [] : petIds)}>
        {/* <Text style={styles.headerCount}>{section.data.length}</Text> */}
        <Image source={require('@assets/icons/pets.png')} style={styles.allBtnIcon} />
        <Text style={styles.allBtnText}>All</Text>
      </TouchableOpacity>
      {healthIndex.map((section, idx) => 
        <TouchableOpacity key={`title-${idx}`} style={[styles.subBtn, !filtered.includes(section.title) && { opacity: 0.3 }]} onPress={() => handleHeaderPress(section.title)}>
          {/* <Text style={styles.headerCount}>{section.data.length}</Text> */}
          <PetInfo pet={petIdToPet(section.title)} size='small' />
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
      <RoundButton onPress={() => navigation.navigate('Create')} type='add' position='bottomRight' />
      {isSuccess ?
        <>
          { !healths.length && <PlaceHolder navigation={navigation} /> }
          
          <SectionList
            ref={sectionListRef}
            sections={healthIndex}
            keyExtractor={(item, index) => item + index}
            ListHeaderComponent={< HealthListHeader />}
            ListHeaderComponentStyle={styles.headerCon}
            renderItem={({ item, index }) => (
              <HealthItem key={item._id} health={item} navigation={navigation} />
            )}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            style={styles.list}
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
  subBtn: {
    width: 80,
  },
  allBtn: {
    width: 80,
    ...Spacing.flexColumn,
    alignSelf: 'center',
  },
  allBtnIcon: {
    width: 50,
    height: 50,
    backgroundColor: Colors.pink.light,
    borderRadius: 99,
    marginBottom: 7,
    marginTop: 5,
  },
  allBtnText: {
    ...Typography.xSmallHeader,
    margin: 0,
  },
  headerCon: {
    width: '100%',
    height: 120,
    alignItems: 'center',
  },
  listHeader: {
  },
  list : {
    width: '100%',    
  },
  headerIcon: {
    ...Forms.xxSmallPhoto,
  },
  headerCount: {
    color: Colors.red.reg,
    fontWeight: 'bold',
    position: 'absolute',
    right: '10%',
    bottom: '10%',
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
    marginLeft: 'auto',
    flex: 1,
  },
})
 
export default HealthIndexScreen