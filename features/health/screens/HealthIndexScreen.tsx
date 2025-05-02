//npm modules
import { FC, useEffect, useRef, useState } from "react"
import { Image, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
//components
import { RoundButton } from "@components/ButtonComponents"
import Loader from "@components/Loader"
import PlaceHolder from "@components/PlaceHolder"
import { ErrorImage } from "@components/UIComponents"
//types & helpers
import PetInfo from "@components/PetInfo/PetInfo"
import { HEALTHS } from "@health/healthHelpers"
import { Health } from "@health/HealthInterface"
import { useShallowPets } from "@hooks/sharedHooks"
import { getActionIconSource, getHealthIconSource } from "@utils/ui"
//queries
import { profileKeyFactory, useGetProfile } from "@profile/profileQueries"
//styles
import { ProfileData } from "@profile/ProfileInterface"
import { Colors, Spacing, Typography, UI } from '@styles/index'
import { useQueryClient } from "@tanstack/react-query"
import { Header } from '@navigation/NavigationStyles'

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
      onPress={() => navigation.navigate('HealthDetails', { healthId: health._id })}
      style={[styles.itemContainer,
      { backgroundColor: Colors.multi.light[health.pet.color] }
    ]}>
      <View style={styles.itemLeft}>
        <Image source={iconSource} style={styles.itemIcon} />
        <Text>{HEALTHS[health.name] ?? health.name}</Text>
        <View style={{ flex: 1 }}>
          <PetInfo pet={health.pet} size='xSmall' />
        </View>
      </View>
      <Image source={getActionIconSource('nextRound')} style={{...UI.icon(), marginRight: 10 }} />
    </TouchableOpacity>
  )
}

const HealthIndexScreen: FC<HealthIndexProps> = ({ navigation, route }) => {
  const queryClient = useQueryClient()
  
  const { data, isSuccess, isFetching, isError } = useGetProfile()
  const healths = data.healths

  const { PET_BASICS, PET_IDS, petIdToPet } = useShallowPets()
  const [filtered, setFiltered] = useState<string[]>(PET_IDS)
 
  const healthIndex: { title: string; data: Health[] }[] = PET_IDS.map(petId => ({
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
    <ScrollView horizontal> 
      <TouchableOpacity style={[styles.btnCon, filtered.length < PET_BASICS.length && { opacity: 0.3 }]} onPress={() => setFiltered(prev => prev.length === PET_BASICS.length ? [] : PET_IDS)}>
        {/* <Text style={styles.headerCount}>{section.data.length}</Text> */}
        <Image source={require('@assets/icons/pets.png')} style={styles.allBtnIcon} />
        <Text style={styles.allBtnText}>All</Text>
      </TouchableOpacity>
      {healthIndex.map((section, idx) => 
        <TouchableOpacity key={`title-${idx}`} style={[styles.btnCon, !filtered.includes(section.title) && { opacity: 0.3 }]} onPress={() => handleHeaderPress(section.title)}>
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
    navigation.setOptions({
      header: () => <Header title='All Pet Care' showGoBackButton={true} rightActions={[{ title: 'Add', onPress: () => navigation.navigate('CareCreate') }]} navigation={navigation} mode='card' />
    })
  }, [route.params, isSuccess])
  
  if (isFetching) return <Loader />
  if (isError) return <ErrorImage />

  return (
    <View style={styles.container}>
      {isSuccess && (
        healths.length > 0 ?
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
          /> 
        : <PlaceHolder type='health' />
      )}
        
    </View> 
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullCon(),
    position: 'relative',
  },
  btnCon: {
    width: 80,
    ...Spacing.flexColumn,
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
    ...Typography.smallHeader,
    margin: 0,
  },
  headerCon: {
    width: '100%',
    height: 120,
    alignItems: 'center',
  },
  list : {
    width: '100%',    
  },
  headerIcon: {
    ...UI.photo('xSmall'),
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
    ...UI.icon(),
    marginHorizontal: 10,
  },
  itemBtn: {
    marginLeft: 'auto',
    flex: 1,
  },
})
 
export default HealthIndexScreen