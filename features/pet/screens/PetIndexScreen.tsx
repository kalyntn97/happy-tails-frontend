//npm modules
import { useState, useRef, useEffect, FC } from 'react'
import { View, StyleSheet, Text, Pressable, useWindowDimensions, FlatList, Image, ScrollView } from "react-native"
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
//components
import PetCard from '../components/PetCard'
import { RoundButton } from '@components/ButtonComponent'
import Loader from '@components/Loader'
import PlaceHolder from '@components/PlaceHolder'
//store & queries
import { Pet } from '../PetInterface'
import { useSetActions } from '@store/store'
import { useGetAllPets } from '@pet/petQueries'
import { AlertForm, getActionIconSource } from '@utils/ui'
//styles
import { Buttons, Spacing, Typography, Colors, Forms } from '@styles/index'

interface PetIndexProps {
  navigation: any
}


const PetIndexScreen: FC<PetIndexProps> = ({ navigation }) => {
  const [currCard, setCurrCard] = useState<number>(0)

  const {data: pets, isSuccess, isLoading, isError } = useGetAllPets()
  const { setPets } = useSetActions()

  const petCount = pets?.length ?? 0
  
  const { width } = useWindowDimensions()
  const scrollX = useSharedValue(0)
  const FlatListRef = useRef<Animated.FlatList<Pet>>(null)
  const DotNavRef = useRef(null)

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

  useEffect(() => {
    if (isSuccess) {
      setPets(pets)
    }
  }, [isSuccess])

  return ( 
    <View style={styles.container}>
      { isLoading && <Loader /> }
      { isError && <Text>Error fetching pets...</Text> }
      { isSuccess &&  <>
        { !pets.length && <PlaceHolder /> }
        
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
              return <PetCard pet={item} index={index} scrollX={scrollX} navigation={navigation}/>
            }}
            ListEmptyComponent={
              <Text style={styles.emptyMsg}>Start managing your pet's health</Text>
            }
          />
          
        </View>

        <View style={styles.rowCon}>
          <Pressable 
            onPress={handleClickPrev} 
            style={[styles.prevBtn, currCard == 0 && styles.disabled]}
            disabled={currCard == 0}
          >
            <Image source={getActionIconSource('prev')} style={{...Forms.smallIcon}}/> 
          </Pressable>
          
          <View style={styles.dotNav}>
            {Array(3).fill(0).map((_, i) =>
              <DotNav key={i} index={i} />
            )}
          </View>
          
          <Pressable 
            onPress={handleClickNext} 
            style={[styles.nextBtn, currCard == petCount - 1  && styles.disabled]}
            disabled={currCard == petCount - 1}
          >
            <Image source={getActionIconSource('next')} style={{ ...Forms.smallIcon }}/> 
          </Pressable>
        </View>
        
      </> } 
      
      <RoundButton onPress={() => navigation.navigate('Create')} type='add' position='bottomRight' />
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
    height: '80%',
    marginTop: 10,
  },
  dotNav: {
    ...Spacing.flexRow,
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