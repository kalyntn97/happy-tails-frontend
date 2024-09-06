//npm modules
import { useRef, useState } from 'react'
import { DimensionValue, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native"
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
//components
import { ActionButton, PhotoButton, RoundButton } from '@components/ButtonComponents'
import Loader from '@components/Loader'
import { ErrorImage, ScrollHeader } from '@components/UIComponents'
import EmptyPetList from '@pet/components/EmptyPetList'
import PetCard from '@pet/components/PetCard'
//store & queries & types
import { StackScreenNavigationProp } from '@navigation/types'
import type { Pet } from '@pet/PetInterface'
import { useGetProfile } from '@profile/profileQueries'
import { getPetIconSource } from '@utils/ui'
//styles
import { Spacing, Typography, UI } from '@styles/index'

const navButtonSize = 'small'
const navSize = 'xSmall'
const navMargin = 5
const navIconWidth = Number(UI.photoSizeMap[navSize].width) + navMargin * 2
const navButtonWith = Number(UI.iconSizeMap[navButtonSize].width)

const PetIndexScreen = ({ navigation }: { navigation: StackScreenNavigationProp }) => {
  const [currCard, setCurrCard] = useState<number>(0)
  const { data, isSuccess, isFetching, isError } = useGetProfile()

  const pets = data.pets

  const petCount: number = pets?.length ?? 0
  
  const { width } = useWindowDimensions()
  const navWidth = width - navMargin * 2 - navButtonWith * 2
  const navNumberOfIcons = Math.floor(navWidth / navButtonWith)

  const scrollX = useSharedValue(0)
  const flatListRef = useRef<Animated.FlatList<Pet>>(null)
  const navRef = useRef<ScrollView>(null)

  const onScrollHandler = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x
  })

  const onScrollEnd = () => {
    const currentIndex = scrollX.value / width
    setCurrCard(currentIndex)
  }

  const handleClickNext = () => {
    // const nextCard = Math.min(currCard + 1, petCount - 1)
    const nextNavPos = scrollX.value + navNumberOfIcons * navIconWidth
    const nextCard = Math.min(currCard + navNumberOfIcons, petCount - 1)
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToIndex({ index: nextCard })
    }
    if (navRef.current) {
      (navRef.current as any).scrollTo({ y: nextNavPos, animated: true })
    }
  }

  const handleClickPrev = () => {
    // const prevCard = Math.max(currCard - 1, 0)
    const prevNavPos = scrollX.value - navNumberOfIcons * navIconWidth
    const prevCard = Math.max(currCard - navNumberOfIcons, 0)
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToIndex({ index: prevCard })
    }
    if (navRef.current) {
      (navRef.current as any).scrollTo({ y: prevNavPos, animated: true })

    }
  }

  const handleClickPhoto = (index: number) => {
    if (flatListRef.current) {
      (flatListRef.current as any).scrollToIndex({ index: index })
    }
  }

  if (isFetching) return <Loader />
  if (isError) return <ErrorImage />

  return ( 
    <View style={styles.container}>
      { isSuccess && pets.length > 0 ? <>
        <View style={styles.petNav}>
          <ActionButton icon='prevRound' onPress={handleClickPrev} size={navButtonSize} disabled={currCard === 0} />
          <ScrollHeader h={0} b={0} t={0} containerStyles={{ flex: 1 }} ref={navRef}>
            { pets.map((pet, index) => 
              <PhotoButton key={`photo-${pet._id}`} photo={pet.photo} placeholder={getPetIconSource('AnimalProfile')} size={navSize} onPress={() => handleClickPhoto(index)} buttonStyles={{ marginHorizontal: navMargin, opacity: currCard === index ? 1 : 0.5 }} />
            ) }
          </ScrollHeader>
          <ActionButton icon='nextRound' onPress={handleClickNext} size={navButtonSize} disabled={currCard === petCount - 1} />
        </View>
      
        <View style={styles.carousel}>
          <Animated.FlatList 
            ref={flatListRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onScrollHandler}
            onMomentumScrollEnd={onScrollEnd}
            data={pets}
            keyExtractor={item => item._id}
            pagingEnabled={true}
            renderItem={({ item, index }) => {
              return <PetCard pet={item} index={index} scrollX={scrollX} navigation={navigation} />
            }}
          />
        </View>

        <RoundButton type='add' size='large' onPress={() => navigation.navigate('PetCreate')} position='bottomRight' />
      </> : 
        <View style={{ ...Spacing.fullWH, justifyContent: 'center' }}> 
          <EmptyPetList navigation={navigation} />
        </View> 
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullCon(),
    alignItems: 'center',
  },
  emptyMsg: {
    ...Typography.xSmallHeader,
  },
  rowCon: {
    width: '90%',
    ...Spacing.flexRow,
    justifyContent: 'space-evenly',
    position: 'relative'
  },
  baseNavBtn: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 99,
    ...Spacing.centered,
    display: 'flex'
  },
  nextBtn: {
    position: 'absolute',
    right: 0
  },
  prevBtn: {
    position: 'absolute',
    left: 0
  },
  carousel: {
    width: '100%',
  },
  petNav: {
    ...Spacing.flexRowStretch,
    marginTop: 50,
    paddingHorizontal: navMargin
  },
  disabled: {
    opacity: 0.5
  }
})

export default PetIndexScreen