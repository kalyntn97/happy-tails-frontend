//npm modules
import { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Text, Pressable, useWindowDimensions, FlatList, Image, ScrollView } from "react-native"
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
//components
import PetCard from '../components/PetCard'
import { AddButton } from '@components/ButtonComponent'
import Loader from '@components/Loader'
import PlaceHolder from '@components/PlaceHolder'
//store & queries
import { Pet } from '../PetInterface'
import { useSetActions } from '@store/store'
import { useGetAllPets } from '@pet/petQueries'
import { AlertForm } from '@utils/ui'
//styles
import { Buttons, Spacing, Typography, Colors, Forms } from '@styles/index'


const PetIndexScreen: React.FC = ({ navigation }) => {
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
    if (DotNavRef.current) {
      (DotNavRef.current as any).scrollToIndex({ index: currentIndex })
    }
  }

  const handleClickNext = () => {
    const nextCard = Math.min(currCard + 1, petCount - 1)
    if (FlatListRef.current) {
      (FlatListRef.current as any).scrollToIndex({ index: nextCard })
    }
    if (DotNavRef.current) {
      (DotNavRef.current as any).scrollToIndex({ index: nextCard })
    }
  }
  const handleClickPrev = () => {
    const prevCard = Math.max(currCard - 1, 0)
    if (FlatListRef.current) {
      (FlatListRef.current as any).scrollToIndex({ index: prevCard })
    }
    if (DotNavRef.current) {
      (DotNavRef.current as any).scrollToIndex({ index: prevCard })
    }
  }

  const DotNav = ({ index }) => {
    const animatedDot = useAnimatedStyle(() => {
      const color = interpolate(
        scrollX.value,
        [(index - 1) * width, index * width, (index + 1) * width],
        [0, 1, 0],
        'clamp'
      )
      return {
        color: color === 1 ? Colors.pink : 'black',
        transform: [
          { scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [1, 1.5, 1],
            'clamp'
          )},
        ]
      }    
    })

    return (
      <Animated.Text style={[styles.dot, animatedDot]}>•</Animated.Text>
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
            <Image source={require('@assets/icons/prev3.png')} style={{...Forms.smallIcon}}/> 
          </Pressable>
          
          <View style={styles.dotNav}>
            <FlatList 
              ref={DotNavRef}
              horizontal 
              data={pets}
              keyExtractor={(item, index )=> index.toString()}
              getItemLayout={(data, index) => (
                {length: 14, offset: 14 * index - 1, index}
              )}
              renderItem={({ item, index }) => {
                return <DotNav key={index} index={index} />
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <Pressable 
            onPress={handleClickNext} 
            style={[styles.nextBtn, currCard == petCount - 1  && styles.disabled]}
            disabled={currCard == petCount - 1}
          >
            <Image source={require('@assets/icons/next3.png')} style={{ ...Forms.smallIcon }}/> 
          </Pressable>
        </View>
        
      </> } 
      
      <AddButton onPress={() => navigation.navigate('Create')} />
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
    height: '70%',
    marginTop: 30,
  },
  dotNav: {
    ...Spacing.flexRow,
    overflow: 'hidden',
    width: 95,
  },
  dot: {
    margin: 10,
    fontSize: 30,
  },
  disabled: {
    opacity: 0.5
  }
})

export default PetIndexScreen