//npm modules
import { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, Pressable, SafeAreaView, ScrollView, useWindowDimensions, FlatList } from "react-native"
//services
import { Pet } from '../api/petsService'
import * as petService from '../api/petsService'
//components
import PetCard from '../components/PetCard'
//styles
import { Buttons, Spacing, Forms, Typography, Colors } from '../styles'

const PetIndexScreen: React.FC = ({ navigation }) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [currCard, setCurrCard] = useState<number>(0)
  const [petCount, setPetCount] = useState<number>(0)

  const windowWidth = useWindowDimensions().width
  const cardWidth = windowWidth * 0.8

  useEffect(() => {
    const fetchAllPets = async () => {
      const petData = await petService.index()
      setPets(petData)
      setPetCount(petData.length)
    }
    fetchAllPets()
  }, [])

  const handleClickNext = () => {
    const nextCard = Math.min(currCard + 1, petCount - 1)
    const scrollPos = nextCard * windowWidth
    setCurrCard(nextCard)
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPos, animated: true })
    }
  }
  const handleClickPrev = () => {
    const prevCard = Math.min(currCard - 1, 0)
    const scrollPos = prevCard * windowWidth
    setCurrCard(prevCard)
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPos, animated: true })
    }
  }

  const getCurrCard = (offset: number, cardWidth: number, petCount: number) => {
    console.log('offset: ', offset, 'CardWidth: ', cardWidth,'Pet Count: ', petCount)
    const currentIndex = Math.floor(offset / cardWidth)
    console.log('curr idx: ', currentIndex, 'new idx: ', Math.min(currentIndex, petCount - 1))
    return Math.min(currentIndex, petCount - 1)
  }

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const newCurrCard = getCurrCard(offsetX, cardWidth, petCount)
    setCurrCard(newCurrCard)
  }

  const handleClickDot = (i) => {
    console.log('curr Card', currCard, 'i', i)
    setCurrCard(i)
    console.log('-----', 'curr Card', currCard, 'i', i)
    const scrollPos = currCard * windowWidth
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: scrollPos, animated: true })
    }
  }

  const handleAddPet = async (name: string, age: number, species: string, breed: string) => {
    const newPet = await petService.create({name, age, species, breed})
    setPets([...pets, newPet])
    navigation.navigate('pets')
  }

  return ( 
    <SafeAreaView style={styles.container}>
      <View style={styles.btnContainer}>
        {currCard > 0 && 
          <Pressable onPress={handleClickPrev} style={styles.prevBtn}>
            <Text>Prev</Text>  
          </Pressable>
        }
        {currCard < petCount - 1 && 
          <Pressable onPress={handleClickNext} style={styles.nextBtn}>
            <Text>Next</Text>  
          </Pressable>
        }
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
            <PetCard key={pet._id} pet={pet} idx={i} currCard={currCard} cardWidth={cardWidth} />
          )}
        </ScrollView>
      </View>
      <View style={styles.dotNav}>
        {pets.map((pet, i) => 
          <Text 
            key={i}
            style={currCard === i ? styles.active : styles.inactive } 
            onPress={(e) => handleClickDot(i)}>
              •
          </Text>
        )}
      </View>
      <Pressable onPress={() => navigation.navigate('Create', { handleAddPet: handleAddPet })} style={styles.addPetBtn}>
        <Text style={styles.btnText}>Add a Pet</Text>
      </Pressable>
    </SafeAreaView>
  )
}
 
const styles = StyleSheet.create({
  container: {
    ...Spacing.centered
  },
  btnContainer: {
    width: '90%',
    height: '10%',
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
    height: '60%',
  },
  dotNav: {
    ...Spacing.flexRow,
    alignItems: 'center',
    width: '90%',
    height: 80,
    padding: 10,
    marginBottom: 10,
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
    marginTop: 20
  },
  btnText: {
    ...Buttons.buttonText,
    color: Colors.lightestPink
  },
})

export default PetIndexScreen