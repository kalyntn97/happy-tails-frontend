//npm modules
import { useState, useRef, useEffect, FC } from 'react'
import { View, StyleSheet, Text, Pressable, useWindowDimensions, FlatList, Image, ScrollView } from "react-native"
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
//components
import PetCard from '../components/PetCard'
import { PhotoButton, RoundButton } from '@components/ButtonComponent'
import PlaceHolder from '@components/PlaceHolder'
import { ErrorImage } from '@components/UIComponents'
//store & queries
import { Pet } from '../PetInterface'
import { profileKeyFactory, useGetProfile } from '@profile/profileQueries'
import { getActionIconSource, getPetIconSource } from '@utils/ui'
//styles
import { Spacing, Typography, Colors, Forms } from '@styles/index'
import Loader from '@components/Loader'

interface PetIndexProps {
  navigation: any
}

const PetIndexScreen: FC<PetIndexProps> = ({ navigation }) => {
  const [currCard, setCurrCard] = useState<number>(0)
  const { data, isFetching, isError } = useGetProfile()

  const pets = data.profile?.pets

  const petCount: number = pets?.length ?? 0
  
  const { width } = useWindowDimensions()
  const scrollX = useSharedValue(0)
  const FlatListRef = useRef<Animated.FlatList<Pet>>(null)

  const onScrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x
  })

  const onScrollEnd = () => {
    const currentIndex = scrollX.value / width
    setCurrCard(currentIndex)
  }

  const handleClickNext = () => {
    const nextCard = Math.min(currCard + 1, petCount - 1)
    if (FlatListRef.current) {
      (FlatListRef.current as any).scrollToIndex({ index: nextCard })
    }
  }
  const handleClickPrev = () => {
    const prevCard = Math.max(currCard - 1, 0)
    if (FlatListRef.current) {
      (FlatListRef.current as any).scrollToIndex({ index: prevCard })
    }
  }

  const handleClickPhoto = (index: number) => {
    if (FlatListRef.current) {
      (FlatListRef.current as any).scrollToIndex({ index: index })
    }
  }

  const DotNav = ({ index }) => {
    const currIndex = currCard === 0 ? 0 : currCard === pets.length - 1 ? 2 : 1
    const animatedDot = useAnimatedStyle(() => {
      const color = interpolate(
        currIndex,
        [index - 1, index , index + 1],
        [0, 1, 0],
        'clamp'
      )
      const scale = interpolate(
        currIndex,
        [index - 1, index , index + 1],
        [1, 1.3, 1],
        'clamp'
      )


      return {
        backgroundColor: color === 1 ? Colors.pink.reg : 'black',
        transform: [{ scale }],
      }    
    })

    return (
      <Animated.View style={[styles.dot, animatedDot, index === 1 && currCard > 1 && { width: 15 }]} />
    )
  }

  if (isFetching) return <Loader />
  if (isError) return <ErrorImage />

  return ( 
    <View style={styles.container}>
      { pets.length > 0 ? 
        <>
          <View style={styles.petNav}>
            <ScrollView horizontal contentContainerStyle={{ minWidth: '100%', justifyContent: 'space-evenly' }} showsHorizontalScrollIndicator={false}>
              {pets.map((pet, index) => 
                <PhotoButton key={`photo-${pet._id}`} photo={pet.photo} placeholder={getPetIconSource('AnimalProfile')} size='small' onPress={() => handleClickPhoto(index)} />
              )}
            </ScrollView>
          </View>
        
          <View style={styles.carousel}>
            <Animated.FlatList 
              ref={FlatListRef}
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
              ListEmptyComponent={
                <Text style={styles.emptyMsg}>Start managing your pet's health</Text>
              }
            />
            
          </View>

          <View style={styles.rowCon}>
            <Pressable 
              onPress={handleClickPrev} 
              style={[styles.prevBtn, currCard == 0 && styles.disabled, styles.baseNavBtn]}
              disabled={currCard == 0}
            >
              <Image source={getActionIconSource('prev')} style={{...Forms.xSmallIcon}}/> 
            </Pressable>
            
            <View style={styles.dotNav}>
              {petCount > 2 && Array(3).fill(0).map((_, i) =>
                <DotNav key={i} index={i} />
              )}
            </View>
            
            <Pressable 
              onPress={handleClickNext} 
              style={[styles.nextBtn, currCard == petCount - 1  && styles.disabled, styles.baseNavBtn]}
              disabled={currCard == petCount - 1}
            >
              <Image source={getActionIconSource('next')} style={{ ...Forms.xSmallIcon }}/> 
            </Pressable>
          </View>

          <RoundButton onPress={() => navigation.navigate('Create')} type='add' position='bottomRight' />

        </> : 
          <View style={{ ...Spacing.fullWH, justifyContent: 'center' }}> 
            <PlaceHolder type='pet' navigation={navigation} /> 
          </View> 
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.fullScreenDown,
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
    height: '65%',
  },
  petNav: {
    marginTop: 50,
    width: '100%',
  },
  dotNav: {
    ...Spacing.flexRow,
    marginTop: 10,
    width: 120,
    justifyContent: 'space-between',
  },
  dot: {
    margin: 10,
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  disabled: {
    opacity: 0.5
  }
})

export default PetIndexScreen