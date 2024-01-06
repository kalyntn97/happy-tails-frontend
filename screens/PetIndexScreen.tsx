//npm modules
import { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Pressable, SafeAreaView, ScrollView, useWindowDimensions, FlatList } from "react-native"
//services
import { Pet } from '../services/petService'
import * as petService from '../services/petService'
//components
import PetCard from '../components/PetCard'
//context
import { usePetContext } from '../context/PetContext'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetIndexScreen: React.FC = ({ navigation }) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const { pets } = usePetContext()
  const petCount: number = pets.length
  const [currCard, setCurrCard] = useState<number>(0)

  const windowWidth = useWindowDimensions().width
  const cardWidth = windowWidth * 0.85

  const handleClickNext = () => {
    const nextCard = Math.min(currCard + 1, petCount - 1)
    const scrollPos = nextCard * ( cardWidth + 20 )
    setCurrCard(nextCard)
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPos, animated: true })
    }
  }
  const handleClickPrev = () => {
    const prevCard = Math.max(currCard - 1, 0)
    const scrollPos = prevCard * ( cardWidth + 20 )
    setCurrCard(prevCard)
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPos, animated: true })
    }
  }

  const getCurrCard = (offset: number, cardWidth: number, petCount: number) => {
    const currentIndex = Math.floor(offset / cardWidth)
    return Math.min(currentIndex, petCount - 1)
  }

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const newCurrCard = getCurrCard(offsetX, cardWidth, petCount)
    setCurrCard(newCurrCard)
  }

  return ( 
    <SafeAreaView style={styles.container}>
      {petCount > 0 ?
        <>    
          <View style={styles.btnContainer}>
            <Pressable 
              onPress={handleClickPrev} 
              style={() => [styles.prevBtn, currCard == 0 && styles.disabled]}
              disabled={currCard == 0}
            >
              <Text>Prev</Text>  
            </Pressable>
            
            <Pressable 
              onPress={handleClickNext} 
              style={()=> [styles.nextBtn, currCard == petCount - 1  && styles.disabled]}
              disabled={currCard == petCount - 1}
            >
              <Text>Next</Text>  
            </Pressable>
          </View>
          
          <View style={styles.carousel}>
            <ScrollView
              ref={scrollViewRef}
              horizontal={true}
              contentContainerStyle={{ width: `${100 * petCount}%` }}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={200}
              decelerationRate="fast"
              pagingEnabled
              onMomentumScrollEnd={handleScroll}
            >
              {pets.map((pet, i) =>
                <PetCard key={pet._id} pet={pet} idx={i} currCard={currCard} cardWidth={cardWidth} navigation={navigation}/>
              )}
            </ScrollView>
          </View>

          <View style={styles.dotNav}>
            {pets.map((pet, i) => 
              <Text 
                key={i}
                style={currCard === i ? styles.active : styles.inactive } 
              >
                •
              </Text>
            )}
          </View>
        </>
      :
        <Text style={styles.emptyMsg}>Start managing your pet's health</Text>
      }

      <Pressable onPress={() => navigation.navigate('Create')} style={styles.addPetBtn}>
        <Text style={styles.btnText}>Add a Pet</Text>
      </Pressable>
    </SafeAreaView>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered,
    ...Spacing.fullScreenDown
  },
  emptyMsg: {
    ...Typography.xSmallHeader,
    
  },
  btnContainer: {
    width: '90%',
    height: '6%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  nextBtn: {
    ...Buttons.smallSub,
    position: 'absolute',
    right: 0
  },
  prevBtn: {
    ...Buttons.smallSub,
    position: 'absolute',
    left: 0
  },
  carousel: {
    width: '90%',
    height: '65%',
  },
  dotNav: {
    ...Spacing.flexRow,
    width: '90%',
    height: '10%',
  },
  active: {
    fontSize: 50,
    margin: 8,
    lineHeight: 60,
    color: Colors.pink
  },
  inactive: {
    fontSize: 30,
    margin: 10,
    lineHeight: 60,
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