//npm
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, FlatList, Modal, TouchableWithoutFeedback, Pressable } from "react-native"
//types & helpers
import { Care } from "@care/CareInterface"
import * as careHelpers from '@care/careHelpers'
//store & queries
import { useSetActions } from "@store/store"
import { useGetProfile } from "@profile/profileQueries"
//components
import CareCard from "@care/components/CareCard"
import SwipeableTask from "@components/SwipeableTask"
import { CloseButton } from "../../components/ButtonComponent"
//styles
import { Buttons, Spacing, Forms, Colors } from '@styles/index'

interface HomeFeedProps {
  navigation: any
}

const HomeFeed: React.FC<HomeFeedProps> = ({ navigation }) => {
  const [sortedCareCards, setSortedCareCards] = useState<{[key: string]: Care[]}>({})
  const [selected, setSelected] = useState<string>('day')
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedTask, setClickedTask] = useState<Care>({})

  const { data, isLoading, isSuccess, isError } = useGetProfile()

 const { setProfile, setPets, setCares, setHealths } = useSetActions()

  const handleClickTask = (task: Care) => {
    setClickedTask(task)
    setModalVisible(true)
  }

  const EmptyList  = () => (
    <Text style={styles.empty}>No tasks to manage.</Text>
  )

  useEffect(() => {
    if (data) {
      const partialProfile = {
        _id: data._id,
        name: data.name,
        bio: data.bio,
        photo: data.photo,
      }
      setSortedCareCards(careHelpers.sortByFrequency(data.careCards))
      //set global states
      setProfile(partialProfile)
      setPets(data.pets)
      setCares(data.careCards)
      setHealths(data.healthCards)
    }
  }, [data])

  return (  
    <View style={styles.container}>

      <View style={styles.iconMenuContainer}>
        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('day')}>
          <Text style={styles.taskCount}>{sortedCareCards['Daily']?.length ?? 0}</Text>
          <Image source={require('@assets/icons/day.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'day' && styles.selected]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('week')}>
          <Text style={styles.taskCount}>{sortedCareCards['Weekly']?.length ?? 0}</Text>
          <Image source={require('@assets/icons/week.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'week' && styles.selected]}>This Week</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('month')}>
          <Text style={styles.taskCount}>{sortedCareCards['Monthly']?.length ?? 0}</Text>
          <Image source={require('@assets/icons/month.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'month' && styles.selected]}>This Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconMenu} onPress={() => setSelected('year')}>
          <Text style={styles.taskCount}>{sortedCareCards['Yearly']?.length ?? 0}</Text>
          <Image source={require('@assets/icons/year.png')} style={styles.icon } />
          <Text style={[styles.iconText, selected === 'year' && styles.selected]}>This Year</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.taskListContainer}>
        { isLoading && <Text>Fetching data... </Text> }
        { isError && <Text>Error fetching data... </Text> }
        { isSuccess && <>
          {selected === 'day' && 
            <FlatList
              data={sortedCareCards['Daily']}
              extraData={sortedCareCards['Daily']}
              keyExtractor={(item, index) => item + index.toString()}
              renderItem={({ item }) => 
                <SwipeableTask key={item._id} task={item} navigation={navigation} 
                  onPress={() => handleClickTask(item)}
                />
              }
              ListEmptyComponent={<EmptyList />}
            />
          }
          
          {selected === 'week' && 
            <FlatList
              data={sortedCareCards['Weekly']}
              keyExtractor={(item, index) => item + index.toString()}
              renderItem={({ item }) => 
                <SwipeableTask key={item._id} task={item} navigation={navigation} 
                  onPress={() => handleClickTask(item)}
                />
              }
              ListEmptyComponent={<EmptyList />}
            />
          }
  
          {selected === 'month' && 
            <FlatList
              data={sortedCareCards['Monthly']}
              keyExtractor={(item, index) => item + index.toString()}
              renderItem={({ item }) => 
                <SwipeableTask key={item._id} task={item} navigation={navigation} 
                  onPress={() => handleClickTask(item)}
                />
              }
              ListEmptyComponent={<EmptyList />}
            />
          }
  
          {selected === 'year' && 
            <FlatList
              data={sortedCareCards['Yearly']}
              keyExtractor={(item, index) => item + index.toString()}
              renderItem={({ item }) => 
                <SwipeableTask key={item._id} task={item} navigation={navigation} 
                  onPress={() => handleClickTask(item)}
                />
              }
              ListEmptyComponent={<EmptyList />}
            />
            }
        </> }
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        onDismiss={() => setClickedTask({})}
      >
        <Pressable onPress={(e) => e.target === e.currentTarget && setModalVisible(false)} style={styles.modalContainer}> 
          <View style={styles.detailContainer}>
            <CloseButton onPress={() => setModalVisible(false)} />
            <CareCard care={clickedTask} navigation={navigation} onNavigate={() => setModalVisible(false)}/>
          </View>
        </Pressable>
      </Modal> 
      

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
    position: 'relative',
  },
  done: {
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  iconMenuContainer: {
    ...Spacing.flexRow,
    width: '100%',
    height: '5%',
    marginVertical: 10
  },
  iconMenu: {
    ...Spacing.flexColumn,
    flexBasis: '25%',
  },
  icon: {
    ...Forms.smallIcon,
  },
  iconText: {

  },
  taskCount: {
    color: Colors.red,
    fontWeight: 'bold',
    position: 'absolute',
    right: '25%',
    top: '15%',
  },
  selected: {
    color: Colors.red,
    fontWeight: 'bold',
  },
  taskListContainer : {
    width: '90%',
    height: '95%',
  },
  taskIcon: {
    ...Forms.smallIcon,
  },
  mainBtn: {
    ...Buttons.smallRounded,
    backgroundColor: Colors.pink,
    marginTop: 50
  },
  btnText: {
    ...Buttons.buttonText,
  },
  modalContainer: {
    ...Spacing.fullWH,
    ...Spacing.centered,
    position: 'relative',
    backgroundColor: Colors.lightestPink,
  },
  detailContainer: {
    width: '100%',
    height: '60%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  empty: {
    marginTop: 100,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
 
export default HomeFeed