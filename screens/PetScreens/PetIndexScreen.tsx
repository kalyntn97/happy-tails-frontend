//npm modules
import { useState, useRef } from 'react'
import { View, StyleSheet, Text, Pressable, useWindowDimensions, FlatList, Image } from "react-native"
//components
import PetCard from '../../components/PetComponents/PetCard'
import { AddButton } from '../../components/ButtonComponent'
//context
import { usePet } from '../../context/PetContext'
//styles
import { Buttons, Spacing, Typography, Colors } from '../../styles'
import Animated, { interpolate, useAnimatedReaction, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const PetIndexScreen: React.FC = ({ navigation }) => {
  const [currCard, setCurrCard] = useState<number>(0)
  const { pets } = usePet()
  const petCount: number = pets.length

  const { width } = useWindowDimensions()
  const scrollX = useSharedValue(0)
  const FlatListRef = useRef<FlatList>(null)

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
      FlatListRef.current.scrollToIndex({ index: nextCard })
    }
  }
  const handleClickPrev = () => {
    const prevCard = Math.max(currCard - 1, 0)
    if (FlatListRef.current) {
      FlatListRef.current.scrollToIndex({ index: prevCard })
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

  return ( 
    <View style={styles.container}>
      {petCount > 0 ?
        <>    
          <View style={styles.btnContainer}>
            <Pressable 
              onPress={handleClickPrev} 
              style={[styles.prevBtn, currCard == 0 && styles.disabled]}
              disabled={currCard == 0}
            >
              <Image source={require('../../assets/icons/prev2.png')} style={{ width: 30, height: 30 }}/> 
            </Pressable>
            
            <Pressable 
              onPress={handleClickNext} 
              style={[styles.nextBtn, currCard == petCount - 1  && styles.disabled]}
              disabled={currCard == petCount - 1}
            >
              <Image source={require('../../assets/icons/next2.png')} style={{ width: 30, height: 30 }}/> 
            </Pressable>
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
                return <PetCard pet={item} index={index} scrollX={scrollX} navigation={navigation}/>
              }}
            />
          </View>

          <View style={styles.dotNav}>
            {pets.map((pet, index) => 
              <DotNav key={index} index={index}/>
            )}
          </View>
        </>
      :
        <Text style={styles.emptyMsg}>Start managing your pet's health</Text>
      }

      <AddButton onPress={() => navigation.navigate('Create')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Spacing.centered,
    ...Spacing.fullScreenDown,
  },
  emptyMsg: {
    ...Typography.xSmallHeader,
    
  },
  btnContainer: {
    width: '90%',
    height: '6%',
    ...Spacing.flexRow,
    justifyContent: 'space-between',
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
    height: '65%',
  },
  dotNav: {
    ...Spacing.flexRow,
    width: '90%',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    margin: 10,
    fontSize: 30,
  },
  addPetBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.darkPink,
    marginBottom: 20,
    height: '10%'
  },
  btnText: {
    ...Buttons.buttonText,
    color: Colors.lightestPink
  },
  disabled: {
    opacity: 0.5
  }
})

export default PetIndexScreen